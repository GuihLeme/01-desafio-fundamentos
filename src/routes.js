import { randomUUID } from 'node:crypto'

import { buildRoutePath } from './utils/build-route-path.js'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if(req.body === null) {
        return res.writeHead(400).end("Para criar uma tarefa são necessários um título e uma descrição.")
      }

      const {title, description} = req.body
      console.log({ title, description })


      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      database.update('tasks', id, {
        title,
        description
      })


      return res.writeHead(204).end('put')
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const updatedTask = database.update('tasks', id, {
        completed_at: new Date()
      })

      if(!updatedTask) {
        return res.writeHead(404).end('Tarefa não encontrada.')
      }

      return res.writeHead(205).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.delete('tasks', id)

      if(!task) {
        return res.writeHead(404).end('Tarefa não encontrada.')
      }

      return res.writeHead(204).end()
    }
  }  
]
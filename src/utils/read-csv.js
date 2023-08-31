import fs from 'node:fs'
import { parse } from 'csv-parse'

const CSVPath = new URL('../../data.csv', import.meta.url)

const stream = fs.createReadStream(CSVPath)

const parser = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

async function readCSVAndCreateTask() {
  const csvParserdLines = stream.pipe(parser)
  for await (const line of csvParserdLines) {
    const [ title, description ] = line

    console.log(line)

    await fetch('http://localhost:3335/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })
  }

  console.log('deu')
}

readCSVAndCreateTask()
import express from 'express'
import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', 'todo.db')

let db = null

async function getDb() {
  if (db) return db

  const SQL = await initSqlJs()

  // Load existing database file if it exists
  let existingData = null
  if (fs.existsSync(dbPath)) {
    existingData = fs.readFileSync(dbPath)
  }

  db = new SQL.Database(existingData)

  // Create todos table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      priority INTEGER DEFAULT 0
    )
  `)

  return db
}

function saveDb() {
  if (!db) return
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
}

const app = express()
app.use(express.json())

// GET /api/todos - Return all todos
app.get('/api/todos', async (req, res) => {
  const database = await getDb()
  const results = database.exec('SELECT * FROM todos')
  const todos = results.length > 0 ? results[0].values.map(row => {
    const cols = results[0].columns
    const obj = {}
    cols.forEach((col, i) => { obj[col] = row[i] })
    return obj
  }) : []
  res.json(todos.map(row => ({
    id: row.id,
    text: row.text,
    done: Boolean(row.done),
    priority: Boolean(row.priority),
  })))
})

// POST /api/todos - Create a new todo
app.post('/api/todos', async (req, res) => {
  const database = await getDb()
  const { text, priority } = req.body
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' })
  }
  database.run('INSERT INTO todos (text, done, priority) VALUES (?, 0, ?)', [text.trim(), priority ? 1 : 0])
  const result = database.exec('SELECT last_insert_rowid() as id')
  const id = result[0].values[0][0]
  const todo = database.exec(`SELECT * FROM todos WHERE id = ${id}`)[0].values[0]
  saveDb()
  res.status(201).json({
    id: todo[0],
    text: todo[1],
    done: Boolean(todo[2]),
    priority: Boolean(todo[3]),
  })
})

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const database = await getDb()
  const { id } = req.params
  const { done, priority } = req.body

  const existing = database.exec(`SELECT * FROM todos WHERE id = ${id}`)
  if (existing.length === 0 || existing[0].values.length === 0) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  const row = existing[0].values[0]
  const newDone = done !== undefined ? (done ? 1 : 0) : row[2]
  const newPriority = priority !== undefined ? (priority ? 1 : 0) : row[3]

  database.run('UPDATE todos SET done = ?, priority = ? WHERE id = ?', [newDone, newPriority, id])
  saveDb()

  const updated = database.exec(`SELECT * FROM todos WHERE id = ${id}`)[0].values[0]
  res.json({
    id: updated[0],
    text: updated[1],
    done: Boolean(updated[2]),
    priority: Boolean(updated[3]),
  })
})

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const database = await getDb()
  const { id } = req.params
  database.run('DELETE FROM todos WHERE id = ?', [id])
  saveDb()
  if (database.getRowsModified() === 0) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  res.status(204).send()
})

// Close database on shutdown
process.on('SIGINT', () => {
  saveDb()
  process.exit(0)
})

process.on('SIGTERM', () => {
  saveDb()
  process.exit(0)
})

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`)
  })
}

export { app, getDb }

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { app, getDb } from '../../server/index'

describe('API', () => {
  let db

  beforeEach(async () => {
    db = await getDb()
    // Clear todos before each test
    db.run('DELETE FROM todos')
  })

  afterEach(() => {
    // Reset the db module cache so each test starts fresh
    db = null
  })

  describe('GET /api/todos', () => {
    it('returns empty array when no todos exist', async () => {
      const res = await request(app).get('/api/todos')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('returns all todos', async () => {
      db.run("INSERT INTO todos (text, done, priority) VALUES ('Test', 0, 0)")
      const res = await request(app).get('/api/todos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        text: 'Test',
        done: false,
        priority: false,
      })
    })
  })

  describe('POST /api/todos', () => {
    it('creates a new todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'New todo' })
      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        text: 'New todo',
        done: false,
        priority: false,
      })
      expect(res.body.id).toBeDefined()
    })

    it('creates a todo with priority', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Urgent', priority: true })
      expect(res.status).toBe(201)
      expect(res.body.priority).toBe(true)
    })

    it('rejects empty text', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: '  ' })
      expect(res.status).toBe(400)
    })

    it('trims whitespace from text', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: '  trimmed  ' })
      expect(res.status).toBe(201)
      expect(res.body.text).toBe('trimmed')
    })
  })

  describe('PUT /api/todos/:id', () => {
    it('toggles done status', async () => {
      db.run("INSERT INTO todos (text, done, priority) VALUES ('Test', 0, 0)")
      const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0]

      const res = await request(app)
        .put(`/api/todos/${id}`)
        .send({ done: true })
      expect(res.status).toBe(200)
      expect(res.body.done).toBe(true)
    })

    it('sets priority', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Test' })
      const id = res.body.id

      const updateRes = await request(app)
        .put(`/api/todos/${id}`)
        .send({ priority: true })
      expect(updateRes.status).toBe(200)
      expect(updateRes.body.priority).toBe(true)
    })

    it('returns 404 for non-existent todo', async () => {
      const res = await request(app)
        .put('/api/todos/999')
        .send({ done: true })
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /api/todos/:id', () => {
    it('deletes a todo', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Delete me' })
      const id = res.body.id

      const deleteRes = await request(app).delete(`/api/todos/${id}`)
      expect(deleteRes.status).toBe(204)

      const getRes = await request(app).get('/api/todos')
      expect(getRes.body).toHaveLength(0)
    })

    it('returns 404 for non-existent todo', async () => {
      const res = await request(app).delete('/api/todos/999')
      expect(res.status).toBe(404)
    })
  })
})

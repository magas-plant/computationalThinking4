import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { deleteObject, insertObject, listObjects, updateObject } from './storage.js'

const PORT = 3001

const app = new Hono()

app.use(cors({ origin: 'http://localhost:3000' }))

app.get('/objects', c => c.json(listObjects()))

app.post('/objects', async (c) => {
  const object = await c.req.json().catch(() => null)
  if (!object?.id || typeof object.id !== 'string') return c.json({ error: 'id is required' }, 400)
  const inserted = insertObject(object)
  if (!inserted) return c.json({ error: 'id already exists' }, 409)
  return c.json(inserted, 201)
})

app.patch('/objects/:id', async (c) => {
  const updated = updateObject(c.req.param('id'), await c.req.json())
  if (!updated) return c.json({ error: 'object not found' }, 404)
  return c.json(updated)
})

app.delete('/objects/:id', (c) => {
  if (!deleteObject(c.req.param('id'))) return c.json({ error: 'object not found' }, 404)
  return c.body(null, 204)
})

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

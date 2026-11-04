import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

// The only place that knows where and how objects are stored.
const FILE = new URL('../data/board.json', import.meta.url)

export type StoredObject = { id: string; [key: string]: unknown }

// Synchronous on purpose: read, change and write run without interruption,
// so requests arriving in quick succession cannot overwrite each other.
function read(): StoredObject[] {
  return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : []
}

function write(objects: StoredObject[]) {
  mkdirSync(new URL('.', FILE), { recursive: true })
  writeFileSync(FILE, JSON.stringify(objects, null, 2))
}

export function listObjects() {
  return read()
}

// Returns null if the id already exists.
export function insertObject(object: StoredObject) {
  const objects = read()
  if (objects.some(existing => existing.id === object.id)) return null
  write([...objects, object])
  return object
}

// Returns null if the id is unknown. The id itself never changes.
export function updateObject(id: string, changes: object) {
  const objects = read()
  const existing = objects.find(object => object.id === id)
  if (!existing) return null
  const updated = { ...existing, ...changes, id }
  write(objects.map(object => (object.id === id ? updated : object)))
  return updated
}

// Returns false if the id is unknown.
export function deleteObject(id: string) {
  const objects = read()
  const remaining = objects.filter(object => object.id !== id)
  if (remaining.length === objects.length) return false
  write(remaining)
  return true
}

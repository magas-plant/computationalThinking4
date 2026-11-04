import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const OBJECTS_URL = 'http://localhost:3001/objects'
const SAVE_DELAY = 300

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

type ObjectChanges = Partial<Rect> & StyleChanges & { text?: string }

// Module level on purpose: useBoard() runs once per caller (app.vue, useObjectGesture,
// useShortcuts), and all of them must share one load and one set of pending saves.
const pendingSaves = new Map<string, { changes: ObjectChanges, timer: ReturnType<typeof setTimeout> }>()
let loadStarted = false

// Collects changes per object and sends them as one PATCH once they pause.
function saveLater(id: string, changes: ObjectChanges) {
  const pending = pendingSaves.get(id)
  clearTimeout(pending?.timer)
  const merged = { ...pending?.changes, ...changes }
  const timer = setTimeout(() => {
    pendingSaves.delete(id)
    $fetch(`${OBJECTS_URL}/${id}`, { method: 'PATCH', body: merged })
  }, SAVE_DELAY)
  pendingSaves.set(id, { changes: merged, timer })
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below,
// which update the local state first and then tell the backend.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])

  onMounted(async () => {
    if (loadStarted) return
    loadStarted = true
    objects.value = await $fetch<BoardObject[]>(OBJECTS_URL)
  })

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    const object = { ...defaults, ...template, id, x, y } as BoardObject
    objects.value = [...objects.value, object]
    $fetch(OBJECTS_URL, { method: 'POST', body: object })
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const id = crypto.randomUUID()
    const object = { ...source, id }
    objects.value = [...objects.value, object]
    $fetch(OBJECTS_URL, { method: 'POST', body: object })
    return id
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    clearTimeout(pendingSaves.get(id)?.timer)
    pendingSaves.delete(id)
    $fetch(`${OBJECTS_URL}/${id}`, { method: 'DELETE' })
  }

  function updateObject(id: string, changes: ObjectChanges) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
    saveLater(id, changes)
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}

import type { BaseItem, ItemStyle, ItemType, Rect } from '~/types/item'
import type { ColorName } from '~/utils/colors'

const START = 120
const HISTORY_LIMIT = 100

// The shared state of all board items. It is read-only from the outside:
// every change goes through one of the functions below.
export function useBoard() {
  const items = useState<BaseItem[]>('board-items', () => [
    {
      id: 'welcome',
      type: 'note',
      x: START,
      y: START,
      width: 192,
      height: 192,
      text: 'Hello, board!',
      color: 'yellow',
      fontSize: 'M',
      bold: false,
    },
  ])
  const history = useState<BaseItem[][]>('board-history', () => [])
  const pending = useState<BaseItem[] | null>('board-pending', () => null)

  // Remembers the current items; they only enter the history once something actually changes,
  // so a click without a change leaves no empty undo step.
  function beginChange() {
    pending.value = items.value
  }

  function commit(next: BaseItem[]) {
    if (pending.value) {
      history.value = [...history.value, pending.value].slice(-HISTORY_LIMIT)
      pending.value = null
    }
    items.value = next
  }

  function undo() {
    const previous = history.value.at(-1)
    if (!previous) return
    history.value = history.value.slice(0, -1)
    pending.value = null
    items.value = previous
  }

  function update(id: string, patch: Partial<BaseItem>) {
    commit(items.value.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  // New items are staggered by one grid cell so they don't land exactly on top of each other.
  function addItem(type: ItemType, color?: ColorName) {
    const { width, height, text, style } = VARIANTS[type]
    const offset = START + items.value.length * GRID_SIZE
    beginChange()
    commit([...items.value, { id: crypto.randomUUID(), type, x: offset, y: offset, width, height, text, color, ...style }])
  }

  // Copies an item one grid cell down and to the right and returns the id of the copy.
  function addCopy(source: BaseItem) {
    const id = crypto.randomUUID()
    beginChange()
    commit([...items.value, { ...source, id, x: source.x + GRID_SIZE, y: source.y + GRID_SIZE }])
    return id
  }

  function removeItem(id: string) {
    beginChange()
    commit(items.value.filter((item) => item.id !== id))
  }

  function moveItem(id: string, x: number, y: number) {
    update(id, { x, y })
  }

  function resizeItem(id: string, rect: Rect) {
    update(id, rect)
  }

  function setText(id: string, text: string) {
    update(id, { text })
  }

  function setStyle(id: string, patch: ItemStyle) {
    beginChange()
    update(id, patch)
  }

  return {
    items: readonly(items),
    addItem,
    addCopy,
    removeItem,
    moveItem,
    resizeItem,
    setText,
    setStyle,
    beginChange,
    undo,
  }
}

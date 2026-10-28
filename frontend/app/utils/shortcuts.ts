import type { Ref } from 'vue'
import type { BaseItem } from '~/types/item'

export interface ShortcutContext {
  board: ReturnType<typeof useBoard>
  selectedId: Ref<string | null>
  clipboard: Ref<BaseItem | null>
}

interface Shortcut {
  keys: string[]
  // Ctrl on Windows/Linux, Cmd on macOS.
  mod?: boolean
  label: string
  run: (ctx: ShortcutContext) => void
}

function selectedItem({ board, selectedId }: ShortcutContext) {
  return board.items.value.find((item) => item.id === selectedId.value) as BaseItem | undefined
}

function moveBy(dx: number, dy: number) {
  return (ctx: ShortcutContext) => {
    const item = selectedItem(ctx)
    if (!item) return
    ctx.board.beginChange()
    ctx.board.moveItem(item.id, item.x + dx, item.y + dy)
  }
}

function copy(ctx: ShortcutContext) {
  const item = selectedItem(ctx)
  if (item) ctx.clipboard.value = { ...item }
}

function remove(ctx: ShortcutContext) {
  if (!ctx.selectedId.value) return
  ctx.board.removeItem(ctx.selectedId.value)
  ctx.selectedId.value = null
}

// All keyboard shortcuts of the board.
export const SHORTCUTS: Shortcut[] = [
  { keys: ['c'], mod: true, label: 'Kopieren', run: copy },
  {
    keys: ['x'],
    mod: true,
    label: 'Ausschneiden',
    run: (ctx) => {
      copy(ctx)
      remove(ctx)
    },
  },
  {
    keys: ['v'],
    mod: true,
    label: 'Einfügen',
    run: (ctx) => {
      const source = ctx.clipboard.value
      if (!source) return
      ctx.selectedId.value = ctx.board.addCopy(source)
      // The clipboard moves along, so pasting again lands one step further.
      ctx.clipboard.value = { ...source, x: source.x + GRID_SIZE, y: source.y + GRID_SIZE }
    },
  },
  {
    keys: ['d'],
    mod: true,
    label: 'Duplizieren',
    run: (ctx) => {
      const item = selectedItem(ctx)
      if (item) ctx.selectedId.value = ctx.board.addCopy(item)
    },
  },
  {
    keys: ['z'],
    mod: true,
    label: 'Rückgängig',
    run: (ctx) => {
      ctx.board.undo()
      if (!selectedItem(ctx)) ctx.selectedId.value = null
    },
  },
  { keys: ['ArrowLeft'], label: 'Nach links', run: moveBy(-GRID_SIZE, 0) },
  { keys: ['ArrowRight'], label: 'Nach rechts', run: moveBy(GRID_SIZE, 0) },
  { keys: ['ArrowUp'], label: 'Nach oben', run: moveBy(0, -GRID_SIZE) },
  { keys: ['ArrowDown'], label: 'Nach unten', run: moveBy(0, GRID_SIZE) },
  { keys: ['Escape'], label: 'Auswahl aufheben', run: (ctx) => (ctx.selectedId.value = null) },
  { keys: ['Backspace', 'Delete'], label: 'Löschen', run: remove },
]

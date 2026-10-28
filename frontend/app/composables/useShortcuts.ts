import type { Ref } from 'vue'
import type { BaseItem } from '~/types/item'

// Runs the matching entry of SHORTCUTS. Keys typed into a text field stay with the text field.
export function useShortcuts(selectedId: Ref<string | null>) {
  const board = useBoard()
  const clipboard = ref<BaseItem | null>(null)

  function onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement
    if (target.closest('textarea, input, [contenteditable]')) return
    const mod = event.ctrlKey || event.metaKey
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
    const shortcut = SHORTCUTS.find((s) => s.keys.includes(key) && !!s.mod === mod)
    if (!shortcut) return
    event.preventDefault()
    shortcut.run({ board, selectedId, clipboard })
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}

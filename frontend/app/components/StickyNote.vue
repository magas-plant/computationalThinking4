<script setup lang="ts">
import { MIN_NOTE_SIZE, snap, type Note } from '~/utils/board'

const props = defineProps<{ note: Note, zoom: number }>()
const emit = defineEmits<{ remove: [] }>()

const editing = ref(false)
const textarea = ref<HTMLTextAreaElement>()
let mode: 'move' | 'resize' | null = null
let start = { px: 0, py: 0, x: 0, y: 0, w: 0, h: 0 }

function begin(e: PointerEvent, next: 'move' | 'resize') {
  if (e.target === textarea.value) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  mode = next
  const { x, y, w, h } = props.note
  start = { px: e.clientX, py: e.clientY, x, y, w, h }
}

function onMove(e: PointerEvent) {
  if (!mode) return
  const dx = (e.clientX - start.px) / props.zoom
  const dy = (e.clientY - start.py) / props.zoom
  if (mode === 'move') {
    props.note.x = snap(start.x + dx)
    props.note.y = snap(start.y + dy)
  } else {
    props.note.w = Math.max(MIN_NOTE_SIZE, snap(start.w + dx))
    props.note.h = Math.max(MIN_NOTE_SIZE, snap(start.h + dy))
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (editing.value) return
  if (e.key === 'Backspace' || (e.ctrlKey && e.key === 'x')) emit('remove')
}

async function edit() {
  editing.value = true
  await nextTick()
  textarea.value?.focus()
}
</script>

<template>
  <div
    tabindex="0"
    class="group absolute cursor-grab select-none shadow-md outline-none focus:ring-2 focus:ring-blue-500"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px`, background: note.color }"
    @pointerdown="begin($event, 'move')"
    @pointermove="onMove"
    @pointerup="mode = null"
    @dblclick="edit"
    @keydown="onKeyDown"
  >
    <textarea
      ref="textarea"
      v-model="note.text"
      placeholder="Schreibe etwas"
      class="size-full resize-none bg-transparent p-3 text-gray-900 outline-none placeholder:text-gray-400"
      :class="editing ? 'cursor-text' : 'pointer-events-none'"
      @blur="editing = false"
    />
    <div
      class="absolute -bottom-1 -right-1 size-3 cursor-nwse-resize rounded-sm border border-blue-500 bg-white opacity-0 group-hover:opacity-100"
      @pointerdown.stop="begin($event, 'resize')"
    />
  </div>
</template>

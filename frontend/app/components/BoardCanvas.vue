<script setup lang="ts">
import { GRID, NOTE_SIZE, snap, type Note } from '~/utils/board'

const notes = ref<Note[]>([])
const offset = reactive({ x: 0, y: 0 })
const zoom = ref(1)
let panning = false

const background = computed(() => {
  const size = GRID * zoom.value
  return {
    backgroundImage: 'radial-gradient(circle, #c4c4c4 1px, transparent 1px)',
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${offset.x - size / 2}px ${offset.y - size / 2}px`
  }
})

function onPointerDown(e: PointerEvent) {
  if (e.target !== e.currentTarget) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  panning = true
}

function onPointerMove(e: PointerEvent) {
  if (!panning) return
  offset.x += e.movementX
  offset.y += e.movementY
}

// Scroll pans, Ctrl/pinch + scroll zooms around the cursor
function onWheel(e: WheelEvent) {
  if (!e.ctrlKey) {
    offset.x -= e.deltaX
    offset.y -= e.deltaY
    return
  }
  const next = Math.min(3, Math.max(0.25, zoom.value * (1 - e.deltaY * 0.01)))
  offset.x = e.clientX - (e.clientX - offset.x) * next / zoom.value
  offset.y = e.clientY - (e.clientY - offset.y) * next / zoom.value
  zoom.value = next
}

function onDrop(e: DragEvent) {
  const color = e.dataTransfer?.getData('text/plain')
  if (!color) return
  const x = (e.clientX - offset.x) / zoom.value - NOTE_SIZE / 2
  const y = (e.clientY - offset.y) / zoom.value - NOTE_SIZE / 2
  notes.value.push({ id: crypto.randomUUID(), x: snap(x), y: snap(y), w: NOTE_SIZE, h: NOTE_SIZE, color, text: '' })
}
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden bg-white"
    :style="background"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="panning = false"
    @wheel.prevent="onWheel"
    @dragover.prevent
    @drop="onDrop"
  >
    <div
      class="absolute left-0 top-0 origin-top-left"
      :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }"
    >
      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :zoom="zoom"
        @remove="notes = notes.filter(n => n.id !== note.id)"
      />
    </div>
    <NoteToolbar />
  </div>
</template>

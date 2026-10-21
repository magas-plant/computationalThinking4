<script setup lang="ts">
import { NOTE_COLORS } from '~/utils/board'

function onDragStart(e: DragEvent, color: string) {
  e.dataTransfer?.setData('text/plain', color)
}
</script>

<template>
  <div class="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-2 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
    <div
      v-for="color in NOTE_COLORS"
      :key="color"
      draggable="true"
      class="size-8 cursor-grab rounded-sm shadow-sm transition hover:scale-110"
      :style="{ background: color }"
      @dragstart="onDragStart($event, color)"
    />
  </div>
</template>

<script setup lang="ts">
import type { BaseItem, ItemStyle } from '~/types/item'

const GAP = 12

const props = defineProps<{ item: BaseItem }>()
const emit = defineEmits<{ change: [patch: ItemStyle] }>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const editors = computed(() => EDITORS.filter((editor) => props.item[editor.attribute] !== undefined))
</script>

<template>
  <!-- Lives inside the canvas so it follows the item, but cancels the zoom to keep its size. -->
  <div
    v-if="editors.length"
    class="absolute z-10 flex items-center rounded-xl border bg-background p-1.5 shadow-md origin-bottom-left cursor-default"
    :style="{
      left: `${item.x}px`,
      top: `${item.y - GAP / scale}px`,
      transform: `translateY(-100%) scale(${1 / scale})`,
    }"
    @pointerdown.stop
    @dblclick.stop
  >
    <template v-for="(editor, index) in editors" :key="editor.attribute">
      <div v-if="index > 0" class="mx-2 h-6 w-px bg-border" />
      <component
        :is="editor.component"
        :item="item"
        :value="item[editor.attribute]"
        @change="(value: unknown) => emit('change', { [editor.attribute]: value })"
      />
    </template>
  </div>
</template>

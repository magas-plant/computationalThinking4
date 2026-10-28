<script setup lang="ts">
import type { ItemStyle, Rect } from '~/types/item'

const { items, moveItem, resizeItem, setText, setStyle, beginChange } = useBoard()
const selectedId = ref<string | null>(null)
const selected = computed(() => items.value.find((item) => item.id === selectedId.value))

useShortcuts(selectedId)
</script>

<template>
  <InfiniteCanvas @pointerdown="selectedId = null">
    <component
      :is="VARIANTS[item.type].component"
      v-for="item in items"
      :key="item.id"
      :item="item"
      :selected="selectedId === item.id"
      @select="selectedId = item.id"
      @change-start="beginChange"
      @move="(x: number, y: number) => moveItem(item.id, x, y)"
      @resize="(rect: Rect) => resizeItem(item.id, rect)"
      @text="(text: string) => setText(item.id, text)"
    />
    <ContextToolbar
      v-if="selected"
      :item="selected"
      @change="(patch: ItemStyle) => setStyle(selected!.id, patch)"
    />
  </InfiniteCanvas>
</template>

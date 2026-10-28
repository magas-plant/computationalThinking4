<script setup lang="ts">
import type { BaseItem, FontSize } from '~/types/item'

defineProps<{ item: BaseItem; value: FontSize }>()
const emit = defineEmits<{ change: [value: FontSize] }>()
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="(_, size) in FONT_SIZES"
      :key="size"
      class="h-8 min-w-8 rounded-md px-2 text-sm hover:bg-muted"
      :class="size === value ? 'bg-muted' : ''"
      :aria-pressed="size === value"
      @click="emit('change', size)"
    >
      {{ size }}
    </button>
  </div>
</template>

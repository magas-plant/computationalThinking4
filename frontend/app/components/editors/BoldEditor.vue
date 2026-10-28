<script setup lang="ts">
import type { BaseItem } from '~/types/item'

defineProps<{ item: BaseItem; value: boolean }>()
const emit = defineEmits<{ change: [value: boolean] }>()
</script>

<template>
  <button
    class="h-8 min-w-8 rounded-md px-2 text-lg font-bold hover:bg-muted"
    :class="value ? 'bg-muted' : ''"
    title="Fett"
    :aria-pressed="value"
    @click="emit('change', !value)"
  >
    B
  </button>
</template>

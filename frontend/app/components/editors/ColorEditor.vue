<script setup lang="ts">
import type { BaseItem } from '~/types/item'
import type { ColorName } from '~/utils/colors'

defineProps<{ item: BaseItem; value: ColorName }>()
const emit = defineEmits<{ change: [value: ColorName] }>()
</script>

<template>
  <div class="flex items-center gap-1.5">
    <button
      v-for="color in VARIANTS[item.type].colors"
      :key="color"
      class="size-7 rounded-md border border-black/10"
      :class="[COLORS[color], color === value ? 'ring-2 ring-blue-500 ring-offset-1' : '']"
      :title="color"
      :aria-label="color"
      @click="emit('change', color)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ItemType } from '~/types/item'
import type { ColorName } from '~/utils/colors'

const emit = defineEmits<{ add: [type: ItemType, color?: ColorName] }>()
</script>

<template>
  <div
    class="fixed bottom-4 left-1/2 -translate-x-1/2 flex h-16 items-stretch overflow-hidden rounded-2xl border bg-background px-3 shadow-lg"
  >
    <template v-for="(variant, type, index) in VARIANTS" :key="type">
      <div v-if="index > 0" class="mx-3 my-3 w-px bg-border" />

      <div class="flex items-end gap-3">
        <!-- Previews sit low so they peek out of the bottom edge, and slide up on hover. -->
        <button
          v-for="color in variant.colors"
          :key="color"
          class="group flex h-full w-14 items-end justify-center"
          :title="`${variant.label} (${color})`"
          :aria-label="`${variant.label} (${color})`"
          @click="emit('add', type, color)"
        >
          <span
            class="translate-y-3 transition-transform group-hover:translate-y-1"
            :class="[variant.preview, COLORS[color]]"
          />
        </button>

        <button
          v-if="variant.icon"
          class="flex h-full w-14 items-center justify-center rounded-lg hover:bg-muted"
          :title="variant.label"
          :aria-label="variant.label"
          @click="emit('add', type)"
        >
          <component :is="variant.icon" class="size-6" />
        </button>
      </div>
    </template>
  </div>
</template>

import type { Component } from 'vue'
import { TypeIcon } from '@lucide/vue'
import type { ItemStyle, ItemType } from '~/types/item'
import type { ColorName } from '~/utils/colors'
import CircleItem from '~/components/CircleItem.vue'
import StickyNote from '~/components/StickyNote.vue'
import TextItem from '~/components/TextItem.vue'

interface Variant {
  label: string
  component: Component
  width: number
  height: number
  // Items without a text show no text and can't be edited.
  text?: string
  // The toolbar offers one button per color, or a single icon button when there are none.
  colors: ColorName[]
  preview?: string
  icon?: Component
  // Starting values, and at the same time the attributes this variant has.
  style: ItemStyle
}

// Everything the board and the toolbar know about the kinds of items lives here.
export const VARIANTS: Record<ItemType, Variant> = {
  note: {
    label: 'Post-it',
    component: StickyNote,
    width: 192,
    height: 192,
    text: 'New post-it',
    colors: ['yellow', 'pink', 'green'],
    preview: 'size-14 rotate-[-4deg] shadow-sm',
    style: { fontSize: 'M', bold: false },
  },
  text: {
    label: 'Text',
    component: TextItem,
    width: 192,
    height: 48,
    text: 'Text',
    colors: [],
    icon: TypeIcon,
    style: { fontSize: 'M', bold: false },
  },
  circle: {
    label: 'Kreis',
    component: CircleItem,
    width: 192,
    height: 192,
    colors: ['blue', 'purple', 'orange'],
    preview: 'size-12 rounded-full border border-black/10',
    style: { border: true },
  },
}

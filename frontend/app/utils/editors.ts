import type { Component } from 'vue'
import type { ItemStyle } from '~/types/item'
import BoldEditor from '~/components/editors/BoldEditor.vue'
import ColorEditor from '~/components/editors/ColorEditor.vue'
import FontSizeEditor from '~/components/editors/FontSizeEditor.vue'

// Which editor edits which attribute. The context toolbar shows an editor
// only when the selected item has that attribute. `border` has no editor on purpose.
export const EDITORS: { attribute: keyof ItemStyle; component: Component }[] = [
  { attribute: 'color', component: ColorEditor },
  { attribute: 'fontSize', component: FontSizeEditor },
  { attribute: 'bold', component: BoldEditor },
]

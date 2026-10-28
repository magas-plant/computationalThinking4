<script setup lang="ts">
import type { BaseItem, Rect } from '~/types/item'

type Corner = 'nw' | 'ne' | 'sw' | 'se'
type Mode = 'move' | Corner

const MIN_SIZE = GRID_SIZE * 3
const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

// The base for every board item: variants only add their look via `class` and `textClass`.
// It never changes the item itself, it only reports what the user did.
const props = defineProps<{ item: BaseItem; selected: boolean; textClass?: string }>()
const emit = defineEmits<{
  'select': []
  'change-start': []
  'move': [x: number, y: number]
  'resize': [rect: Rect]
  'text': [text: string]
}>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const editing = ref(false)
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

let interaction: { mode: Mode; startX: number; startY: number; start: BaseItem } | null = null

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  emit('select')
  if (editing.value) return
  emit('change-start')
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { ...props.item } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

// Resizing from a north or west corner moves the item so the opposite corner stays put.
function nextRect(mode: Mode, start: BaseItem, dx: number, dy: number): Rect {
  if (mode === 'move') return { ...start, x: snapToGrid(start.x + dx), y: snapToGrid(start.y + dy) }
  const width = Math.max(MIN_SIZE, snapToGrid(start.width + (mode.endsWith('e') ? dx : -dx)))
  const height = Math.max(MIN_SIZE, snapToGrid(start.height + (mode.startsWith('s') ? dy : -dy)))
  return {
    width,
    height,
    x: mode.endsWith('w') ? start.x + start.width - width : start.x,
    y: mode.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  const rect = nextRect(interaction.mode, interaction.start, dx, dy)
  if (interaction.mode === 'move') emit('move', rect.x, rect.y)
  else emit('resize', rect)
}

function onPointerUp() {
  interaction = null
}

// Only items that have a text can be edited.
async function startEditing() {
  if (props.item.text === undefined) return
  emit('change-start')
  editing.value = true
  await nextTick()
  textarea.value?.focus()
  textarea.value?.select()
}

function stopEditing() {
  editing.value = false
}

function updateText(event: Event) {
  emit('text', (event.target as HTMLTextAreaElement).value)
}

// Grows the item to the next grid line when its text no longer fits.
async function fitToContent() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (!element) return
  const needed = Math.max(MIN_SIZE, Math.ceil(element.scrollHeight / GRID_SIZE) * GRID_SIZE)
  const { x, y, width, height } = props.item
  if (needed > height) emit('resize', { x, y, width, height: needed })
}

watch(
  () => [props.item.text, props.item.width, props.item.height, props.item.fontSize, props.item.bold, editing.value],
  fitToContent,
)
onMounted(fitToContent)
</script>

<template>
  <div
    class="absolute touch-none"
    :class="[
      item.color && COLORS[item.color],
      item.fontSize && FONT_SIZES[item.fontSize],
      item.bold && 'font-bold',
      item.border && BORDER,
      selected ? 'ring-2 ring-blue-300' : '',
      editing ? 'cursor-text' : 'cursor-move',
    ]"
    :style="{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @dblclick="startEditing"
  >
    <template v-if="item.text !== undefined">
      <textarea
        v-if="editing"
        ref="textarea"
        class="size-full bg-transparent resize-none outline-none"
        :class="textClass"
        :value="item.text"
        @input="updateText"
        @blur="stopEditing"
        @keydown.escape="stopEditing"
      />
      <div
        v-else
        ref="content"
        class="size-full overflow-hidden whitespace-pre-wrap break-words select-none"
        :class="textClass"
      >
        {{ item.text }}
      </div>
    </template>

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="startInteraction($event, corner)"
      />
    </template>
  </div>
</template>

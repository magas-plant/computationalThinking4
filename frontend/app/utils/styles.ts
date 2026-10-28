import type { FontSize } from '~/types/item'

// Full class names, so Tailwind finds them when scanning the source.
export const FONT_SIZES: Record<FontSize, string> = {
  S: 'text-sm',
  M: 'text-lg',
  L: 'text-2xl',
  XL: 'text-4xl',
}

export const BORDER = 'border border-black/10'

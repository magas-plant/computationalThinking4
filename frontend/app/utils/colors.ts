// Full class names, so Tailwind finds them when scanning the source.
export const COLORS = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  green: 'bg-green-200',
  blue: 'bg-sky-200',
  purple: 'bg-violet-200',
  orange: 'bg-orange-200',
} as const

export type ColorName = keyof typeof COLORS

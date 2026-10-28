import type { ColorName } from '~/utils/colors'

export type ItemType = 'note' | 'text' | 'circle'

export type FontSize = 'S' | 'M' | 'L' | 'XL'

// An item "has" an attribute when the field is set.
export interface ItemStyle {
  color?: ColorName
  fontSize?: FontSize
  bold?: boolean
  border?: boolean
}

export interface BaseItem extends ItemStyle {
  id: string
  type: ItemType
  x: number
  y: number
  width: number
  height: number
  text?: string
}

export type Rect = Pick<BaseItem, 'x' | 'y' | 'width' | 'height'>

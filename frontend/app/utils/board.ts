export const GRID = 20
export const NOTE_SIZE = 160
export const MIN_NOTE_SIZE = 80
export const NOTE_COLORS = ['#fff9b1', '#ffc6d9', '#c9f2c7', '#c6e4ff']

export interface Note {
  id: string
  x: number
  y: number
  w: number
  h: number
  color: string
  text: string
}

export const snap = (value: number) => Math.round(value / GRID) * GRID

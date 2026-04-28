import { getSquareById } from './boardSquares'
import type { SpaceKind } from '../types/game'

/** Variante visual de casilla (solo UI) */
export type TileTone = 'path' | 'product' | 'event'

export interface BoardVisual {
  rainbowIndex: number
  wellLabel: string
  chip?: string
  tileTone: TileTone
}

const RAINBOW_BG: Record<number, string> = {
  0: 'bg-rainbow-0',
  1: 'bg-rainbow-1',
  2: 'bg-rainbow-2',
  3: 'bg-rainbow-3',
  4: 'bg-rainbow-4',
  5: 'bg-rainbow-5',
  6: 'bg-rainbow-6',
}

export function rainbowBgClass(index: number): string {
  return RAINBOW_BG[index % 7] ?? 'bg-rainbow-0'
}

function toneForKind(kind: SpaceKind): TileTone {
  if (kind === 'neutral' || kind === 'start') return 'path'
  if (kind === 'cookie') return 'product'
  return 'event'
}

function chipForKind(kind: SpaceKind): string | undefined {
  switch (kind) {
    case 'cookie':
      return 'Galleta'
    case 'challenge':
      return 'Reto'
    case 'boost':
      return 'Boost'
    case 'swap':
      return 'Swap'
    case 'extraTurn':
      return 'x2'
    case 'block':
      return 'Bloqueo'
    case 'shield':
      return 'Escudo'
    case 'finish':
      return 'META'
    default:
      return undefined
  }
}

export function getBoardVisual(id: number): BoardVisual {
  const rainbowIndex = (id - 1) % 7
  const sq = getSquareById(id)
  const kind = sq?.kind ?? 'neutral'

  if (id === 1) {
    return { rainbowIndex: 0, wellLabel: 'SALIDA', chip: 'Inicio', tileTone: 'event' }
  }
  if (id === 45) {
    return { rainbowIndex: 6, wellLabel: 'META', chip: 'Cofre', tileTone: 'event' }
  }

  if (kind === 'neutral') {
    return { rainbowIndex, wellLabel: '·', tileTone: 'path' }
  }

  return {
    rainbowIndex,
    wellLabel: sq?.title?.slice(0, 3) ?? '·',
    chip: chipForKind(kind),
    tileTone: toneForKind(kind),
  }
}

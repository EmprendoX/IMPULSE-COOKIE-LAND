export type WheelFollowUp =
  | 'none'
  | 'challenge'
  | 'doubleCraving'
  | 'rescue'
  | 'shield'
  | 'block'

export interface WheelSegment {
  id: string
  label: string
  shortLabel: string
  color: string
  steps: number
  followUp: WheelFollowUp
}

/** 14 segmentos según reglas CookieLand Impulse */
export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'm1', label: 'Avanza 1', shortLabel: '+1', color: '#ff7a59', steps: 1, followUp: 'none' },
  { id: 'm2a', label: 'Avanza 2', shortLabel: '+2', color: '#ffb347', steps: 2, followUp: 'none' },
  { id: 'm2b', label: 'Avanza 2', shortLabel: '+2', color: '#ffb347', steps: 2, followUp: 'none' },
  { id: 'm3a', label: 'Avanza 3', shortLabel: '+3', color: '#ffe066', steps: 3, followUp: 'none' },
  { id: 'm3b', label: 'Avanza 3', shortLabel: '+3', color: '#ffe066', steps: 3, followUp: 'none' },
  { id: 'm4a', label: 'Avanza 4', shortLabel: '+4', color: '#52d681', steps: 4, followUp: 'none' },
  { id: 'm4b', label: 'Avanza 4', shortLabel: '+4', color: '#52d681', steps: 4, followUp: 'none' },
  { id: 'm5', label: 'Avanza 5', shortLabel: '+5', color: '#4dabf7', steps: 5, followUp: 'none' },
  { id: 'm6', label: 'Avanza 6', shortLabel: '+6', color: '#8b5cf6', steps: 6, followUp: 'none' },
  {
    id: 'ch3',
    label: 'Reto +3',
    shortLabel: 'R+3',
    color: '#f472b6',
    steps: 3,
    followUp: 'challenge',
  },
  {
    id: 'ad2',
    label: 'Antojo x2 +2',
    shortLabel: 'A+2',
    color: '#22d3ee',
    steps: 2,
    followUp: 'doubleCraving',
  },
  {
    id: 'rs1',
    label: 'Rescate +1',
    shortLabel: 'Rs+1',
    color: '#a78bfa',
    steps: 1,
    followUp: 'rescue',
  },
  {
    id: 'sh3',
    label: 'Escudo +3',
    shortLabel: 'E+3',
    color: '#facc15',
    steps: 3,
    followUp: 'shield',
  },
  {
    id: 'bl2',
    label: 'Bloqueo +2',
    shortLabel: 'B+2',
    color: '#fb7185',
    steps: 2,
    followUp: 'block',
  },
]

export const WHEEL_SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS.length

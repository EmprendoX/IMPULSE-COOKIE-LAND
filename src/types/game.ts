/** Sabores fijos + semanales (ids estables) */
export type FlavorId =
  | 'chocolateChip'
  | 'nutella'
  | 'cookiesCream'
  | 'brownieBatter'
  | 'snickerdoodle'
  | 'weekly1'
  | 'weekly2'
  | 'weekly3'
  | 'weekly4'

export const CORE_FLAVOR_IDS: FlavorId[] = [
  'chocolateChip',
  'nutella',
  'cookiesCream',
  'brownieBatter',
  'snickerdoodle',
]

export type GameMode = 'familiar' | 'degustacionTotal'

export type CookieCount = 6 | 7 | 8 | 9

export type SpaceKind =
  | 'start'
  | 'neutral'
  | 'cookie'
  | 'challenge'
  | 'boost'
  | 'swap'
  | 'extraTurn'
  | 'block'
  | 'shield'
  | 'finish'

export interface BoardSquare {
  id: number
  title: string
  modalBody: string
  kind: SpaceKind
  flavorId?: FlavorId
}

export type AppScreen = 'home' | 'playing' | 'won'

export interface UnlockedReward {
  id: string
  unlockedAt: number
}

export interface WeeklyLabels {
  weekly1: string
  weekly2: string
  weekly3: string
  weekly4: string
}

export interface GameConfig {
  cookieCount: CookieCount
  mode: GameMode
  weeklyLabels: WeeklyLabels
}

/** Bloqueo global de sabor: expira al volver el turno al jugador que lo impuso */
export interface FlavorBlockState {
  flavorId: FlavorId
  ownerPlayerIndex: number
}

export interface GamePlayer {
  id: string
  name: string
  color: string
  position: number
  tastedFlavorIds: FlavorId[]
  missedFlavorIds: FlavorId[]
  shields: number
  extraTurn: boolean
  skipNextBite: boolean
}

export interface GamePersist {
  players: GamePlayer[]
  activePlayerIndex: number
  unlockedRewards: UnlockedReward[]
  screen: AppScreen
  lastSpinLabel: string | null
  rollHint: string | null
  spinCount: number
  winnerName: string | null
  config: GameConfig
  flavorBlock: FlavorBlockState | null
}

export const BOARD_SIZE = 45 as const

export const STORAGE_KEY = 'impulse-cookieland-save'

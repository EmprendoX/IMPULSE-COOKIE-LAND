import type { GamePersist, GamePlayer } from '../types/game'
import { STORAGE_KEY } from '../types/game'
import { defaultGameConfig } from '../data/flavors'

const PLAYER_COLORS = ['#ff8a5b', '#ffd166', '#5ad6a0', '#5bbcff'] as const
const DEFAULT_PLAYER_NAMES = ['Jugador 1', 'Jugador 2'] as const

function buildPlayer(name: string, index: number): GamePlayer {
  return {
    id: `player-${index + 1}`,
    name,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    position: 1,
    tastedFlavorIds: [],
    missedFlavorIds: [],
    shields: 0,
    extraTurn: false,
    skipNextBite: false,
  }
}

function normalizePlayers(players?: Partial<GamePlayer>[]): GamePlayer[] {
  if (!Array.isArray(players) || players.length === 0) {
    return DEFAULT_PLAYER_NAMES.map((name, index) => buildPlayer(name, index))
  }

  return players.slice(0, 4).map((player, index) => {
    const base = buildPlayer(player.name?.trim() || `Jugador ${index + 1}`, index)
    const tasted = Array.isArray(player.tastedFlavorIds) ? player.tastedFlavorIds : []
    const missed = Array.isArray(player.missedFlavorIds) ? player.missedFlavorIds : []
    return {
      ...base,
      ...player,
      name: player.name?.trim() || `Jugador ${index + 1}`,
      color: player.color || PLAYER_COLORS[index % PLAYER_COLORS.length],
      position: typeof player.position === 'number' ? player.position : 1,
      tastedFlavorIds: tasted,
      missedFlavorIds: missed,
      shields: typeof player.shields === 'number' ? player.shields : 0,
      extraTurn: Boolean(player.extraTurn),
      skipNextBite: Boolean(player.skipNextBite),
    }
  })
}

export const defaultPersist = (): GamePersist => ({
  players: DEFAULT_PLAYER_NAMES.map((name, index) => buildPlayer(name, index)),
  activePlayerIndex: 0,
  unlockedRewards: [],
  screen: 'home',
  lastSpinLabel: null,
  rollHint: null,
  spinCount: 0,
  winnerName: null,
  config: defaultGameConfig(),
  flavorBlock: null,
})

export function loadGame(): GamePersist {
  if (typeof localStorage === 'undefined') return defaultPersist()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPersist()
    const parsed = JSON.parse(raw) as Partial<GamePersist> & { lastSpin?: number | null }
    const players = normalizePlayers(parsed.players)
    const config = parsed.config ?? defaultGameConfig()

    return {
      ...defaultPersist(),
      ...parsed,
      players,
      config: {
        ...defaultGameConfig(),
        ...config,
        weeklyLabels: {
          ...defaultGameConfig().weeklyLabels,
          ...(config.weeklyLabels ?? {}),
        },
      },
      flavorBlock:
        parsed.flavorBlock &&
        typeof parsed.flavorBlock.flavorId === 'string' &&
        typeof parsed.flavorBlock.ownerPlayerIndex === 'number'
          ? parsed.flavorBlock
          : null,
      activePlayerIndex:
        typeof parsed.activePlayerIndex === 'number'
          ? Math.min(Math.max(parsed.activePlayerIndex, 0), players.length - 1)
          : 0,
      unlockedRewards: Array.isArray(parsed.unlockedRewards) ? parsed.unlockedRewards : [],
      winnerName: typeof parsed.winnerName === 'string' ? parsed.winnerName : null,
      lastSpinLabel:
        typeof parsed.lastSpinLabel === 'string'
          ? parsed.lastSpinLabel
          : typeof parsed.lastSpin === 'number'
            ? String(parsed.lastSpin)
            : null,
    }
  } catch {
    return defaultPersist()
  }
}

export function saveGame(state: GamePersist): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota / private mode */
  }
}

export { normalizePlayers }

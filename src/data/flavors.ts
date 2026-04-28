import type { CookieCount, FlavorId, GameConfig, GameMode, WeeklyLabels } from '../types/game'
import { CORE_FLAVOR_IDS } from '../types/game'

const WEEKLY_IDS: FlavorId[] = ['weekly1', 'weekly2', 'weekly3', 'weekly4']

export function weeklySlotsForCookieCount(count: CookieCount): number {
  switch (count) {
    case 6:
      return 1
    case 7:
      return 2
    case 8:
      return 3
    case 9:
      return 4
    default:
      return 1
  }
}

/** Sabores que participan en esta partida (5 core + N weekly) */
export function activeFlavorIds(cookieCount: CookieCount): FlavorId[] {
  const n = weeklySlotsForCookieCount(cookieCount)
  return [...CORE_FLAVOR_IDS, ...WEEKLY_IDS.slice(0, n)]
}

export function isWeeklyFlavor(id: FlavorId): boolean {
  return WEEKLY_IDS.includes(id)
}

export function isWeeklyActive(id: FlavorId, cookieCount: CookieCount): boolean {
  if (!isWeeklyFlavor(id)) return true
  const idx = WEEKLY_IDS.indexOf(id) + 1
  return idx <= weeklySlotsForCookieCount(cookieCount)
}

export function targetFlavorCount(mode: GameMode, cookieCount: CookieCount): number {
  if (mode === 'degustacionTotal') return activeFlavorIds(cookieCount).length
  switch (cookieCount) {
    case 6:
      return 5
    case 7:
      return 6
    case 8:
      return 7
    case 9:
      return 7
    default:
      return 5
  }
}

const CORE_LABELS: Record<Exclude<FlavorId, 'weekly1' | 'weekly2' | 'weekly3' | 'weekly4'>, string> =
  {
    chocolateChip: 'Chocolate Chip',
    nutella: 'Nutella',
    cookiesCream: 'Cookies & Cream',
    brownieBatter: 'Brownie Batter',
    snickerdoodle: 'Snickerdoodle',
  }

export function flavorLabel(id: FlavorId, weekly: WeeklyLabels): string {
  if (id === 'weekly1') return weekly.weekly1.trim() || 'Weekly #1'
  if (id === 'weekly2') return weekly.weekly2.trim() || 'Weekly #2'
  if (id === 'weekly3') return weekly.weekly3.trim() || 'Weekly #3'
  if (id === 'weekly4') return weekly.weekly4.trim() || 'Weekly #4'
  return CORE_LABELS[id]
}

export function defaultWeeklyLabels(): WeeklyLabels {
  return {
    weekly1: 'Weekly #1',
    weekly2: 'Weekly #2',
    weekly3: 'Weekly #3',
    weekly4: 'Weekly #4',
  }
}

export function defaultGameConfig(): GameConfig {
  return {
    cookieCount: 6,
    mode: 'familiar',
    weeklyLabels: defaultWeeklyLabels(),
  }
}

export function hasTasted(player: { tastedFlavorIds: FlavorId[] }, id: FlavorId): boolean {
  return player.tastedFlavorIds.includes(id)
}

export function addUnique(list: FlavorId[], id: FlavorId): FlavorId[] {
  if (list.includes(id)) return list
  return [...list, id]
}

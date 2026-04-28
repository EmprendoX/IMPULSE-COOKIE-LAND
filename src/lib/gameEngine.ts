import { getSquareById } from '../data/boardSquares'
import {
  activeFlavorIds,
  flavorLabel,
  isWeeklyActive,
} from '../data/flavors'
import type { BoardSquare, CookieCount, FlavorId, GameConfig, GamePlayer } from '../types/game'
import { BOARD_SIZE } from '../types/game'

export function clampBoard(n: number): number {
  return Math.min(BOARD_SIZE, Math.max(1, n))
}

export function getNextPlayerIndex(players: GamePlayer[], currentIndex: number): number {
  return (currentIndex + 1) % players.length
}

/** Casilla cookie: sabor efectivo o 'wildcard' si weekly inactivo */
export function effectiveCookieFlavor(
  square: BoardSquare,
  cookieCount: CookieCount,
): FlavorId | 'wildcard' | null {
  if (square.kind !== 'cookie' || !square.flavorId) return null
  if (isWeeklyActive(square.flavorId, cookieCount)) return square.flavorId
  return 'wildcard'
}

/** Posiciones estrictamente entre from y to (excluye ambos extremos), avance positivo */
export function positionsBetween(from: number, to: number): number[] {
  if (to <= from) return []
  const out: number[] = []
  for (let p = from + 1; p < to; p += 1) out.push(p)
  return out
}

export function collectMissedFromPath(
  player: GamePlayer,
  from: number,
  to: number,
  config: GameConfig,
): { player: GamePlayer; hints: string[] } {
  const hints: string[] = []
  let next = { ...player }
  const actives = new Set(activeFlavorIds(config.cookieCount))

  for (const pos of positionsBetween(from, to)) {
    const sq = getSquareById(pos)
    if (!sq || sq.kind !== 'cookie' || !sq.flavorId) continue
    const eff = effectiveCookieFlavor(sq, config.cookieCount)
    if (eff === 'wildcard' || eff === null) continue
    if (!actives.has(eff)) continue
    if (next.tastedFlavorIds.includes(eff)) continue
    if (!next.missedFlavorIds.includes(eff)) {
      next = {
        ...next,
        missedFlavorIds: [...next.missedFlavorIds, eff],
      }
      hints.push(
        `Pasaste por ${flavorLabel(eff, config.weeklyLabels)}, pero no caíste ahí. Queda como antojo pendiente.`,
      )
    }
  }

  return { player: next, hints }
}

/** Última casilla cookie ≤ pos cuyo sabor activo falta en tasted */
export function nearestPendingCookieBehind(
  pos: number,
  tasted: FlavorId[],
  config: GameConfig,
): number | null {
  const need = new Set(
    activeFlavorIds(config.cookieCount).filter((id) => !tasted.includes(id)),
  )
  if (need.size === 0) return null

  for (let id = pos; id >= 1; id -= 1) {
    const sq = getSquareById(id)
    if (!sq || sq.kind !== 'cookie' || !sq.flavorId) continue
    const eff = effectiveCookieFlavor(sq, config.cookieCount)
    if (eff === 'wildcard' || eff === null) continue
    if (!need.has(eff)) continue
    return id
  }
  return null
}

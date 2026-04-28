import { activeFlavorIds, flavorLabel, targetFlavorCount } from '../data/flavors'
import type { CookieCount, FlavorId, GameMode, GamePlayer, WeeklyLabels } from '../types/game'

export interface PassportPanelProps {
  player: GamePlayer
  cookieCount: CookieCount
  mode: GameMode
  weeklyLabels: WeeklyLabels
}

export function PassportPanel({ player, cookieCount, mode, weeklyLabels }: PassportPanelProps) {
  const ids = activeFlavorIds(cookieCount)
  const need = targetFlavorCount(mode, cookieCount)
  const tasted = new Set(player.tastedFlavorIds)
  const missed = new Set(player.missedFlavorIds)

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/6 px-4 py-3 backdrop-blur-md">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/42">
        Pasaporte de sabores
      </p>
      <p className="mt-1 text-xs text-white/65">
        Objetivo: <span className="font-black text-amber-200">{need}</span> sabores · Probados:{' '}
        <span className="font-black text-amber-200">{player.tastedFlavorIds.length}</span>
      </p>
      <ul className="mt-3 space-y-2">
        {ids.map((id: FlavorId) => {
          const ok = tasted.has(id)
          const pend = missed.has(id)
          return (
            <li
              key={id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm"
            >
              <span className="font-bold text-white">{flavorLabel(id, weeklyLabels)}</span>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-white/55">
                {ok ? '✓ Probado' : pend ? 'Antojo pendiente' : 'Pendiente'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

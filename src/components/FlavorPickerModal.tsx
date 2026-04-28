import { flavorLabel } from '../data/flavors'
import type { FlavorId, WeeklyLabels } from '../types/game'
import type { FlavorPickKind } from '../hooks/useGameState'

export interface FlavorPickerModalProps {
  kind: FlavorPickKind
  allowed: FlavorId[]
  weeklyLabels: WeeklyLabels
  onPick: (id: FlavorId) => void
  onCancel: () => void
}

const TITLES: Record<FlavorPickKind, string> = {
  rescue: 'Rescate de sabor',
  wildcard: 'Comodín de sabor',
  doubleCravingSecond: 'Antojo doble — segundo bocado',
  blockWheel: 'Bloqueo (rueda)',
  blockBoard: 'Bloqueo (casilla)',
  metaFallback: 'Elige un sabor pendiente',
}

export function FlavorPickerModal({
  kind,
  allowed,
  weeklyLabels,
  onPick,
  onCancel,
}: FlavorPickerModalProps) {
  if (allowed.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0918cc] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,#1f2740,#120a22)] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
      >
        <h2 className="text-center text-xl font-black text-white">{TITLES[kind]}</h2>
        <p className="mt-2 text-center text-sm text-white/70">Toca un sabor</p>
        <div className="mt-4 grid max-h-[50vh] gap-2 overflow-y-auto">
          {allowed.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              className="flex min-h-12 items-center justify-center rounded-[1.2rem] border border-amber-200/25 bg-white/8 px-4 py-3 text-left text-sm font-black text-white"
            >
              {flavorLabel(id, weeklyLabels)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full rounded-[1.2rem] border border-white/12 bg-white/5 py-3 text-sm font-bold text-white/80"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

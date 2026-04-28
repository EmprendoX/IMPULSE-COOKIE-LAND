export interface SwapModalProps {
  open: boolean
  players: { id: string; name: string; color: string }[]
  currentIndex: number
  onPick: (otherIndex: number) => void
  onCancel: () => void
}

export function SwapModal({ open, players, currentIndex, onPick, onCancel }: SwapModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0918cc] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,#1a2040,#0f0a1c)] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.45)]">
        <h2 className="text-center text-xl font-black text-white">Intercambio</h2>
        <p className="mt-2 text-center text-sm text-white/70">Elige con quién cambias posición</p>
        <div className="mt-4 grid gap-2">
          {players.map((pl, index) => {
            if (index === currentIndex) return null
            return (
              <button
                key={pl.id}
                type="button"
                onClick={() => onPick(index)}
                className="flex min-h-12 items-center gap-3 rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3 text-left font-black text-white"
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pl.color }} />
                {pl.name}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full rounded-[1.2rem] border border-white/12 py-3 text-sm font-bold text-white/75"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

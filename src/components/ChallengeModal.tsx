import type { ChallengeCard } from '../data/challenges'

export interface ChallengeModalProps {
  card: ChallengeCard | null
  onOutcome: (outcome: 'done' | 'fail' | 'close') => void
}

export function ChallengeModal({ card, onOutcome }: ChallengeModalProps) {
  if (!card) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0918cc] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOutcome('close')
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,#2c173f,#160d28)] shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
      >
        <div className="bg-[radial-gradient(circle_at_top,rgba(255,230,146,0.3),transparent_55%)] px-6 pb-6 pt-7">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-white/15 bg-white/8 text-4xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md">
            🎯
          </div>
          <p className="mt-4 text-center text-[0.68rem] font-black uppercase tracking-[0.3em] text-amber-200/75">
            Reto
          </p>
          <h2 className="mt-2 text-center text-2xl font-black leading-tight text-white">{card.title}</h2>
          <p className="mt-4 text-center text-[0.98rem] leading-relaxed text-white/78">{card.body}</p>
        </div>

        <div className="grid gap-2 border-t border-white/10 bg-black/10 px-6 py-5">
          <button
            type="button"
            onClick={() => onOutcome('done')}
            className="flex min-h-12 items-center justify-center rounded-[1.3rem] border border-emerald-300/40 bg-emerald-500/20 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-emerald-100"
          >
            Cumplido
          </button>
          <button
            type="button"
            onClick={() => onOutcome('fail')}
            className="flex min-h-12 items-center justify-center rounded-[1.3rem] border border-rose-300/35 bg-rose-500/15 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-rose-100"
          >
            No cumplido
          </button>
          <button
            type="button"
            onClick={() => onOutcome('close')}
            className="flex min-h-12 items-center justify-center rounded-[1.3rem] border border-white/14 bg-white/8 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

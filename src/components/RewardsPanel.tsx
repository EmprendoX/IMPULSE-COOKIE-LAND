import { FLAVOR_LEGEND, REWARD_LABELS } from '../data/rewardLabels'
import type { UnlockedReward } from '../types/game'

export interface RewardsPanelProps {
  rewards: UnlockedReward[]
}

export function RewardsPanel({ rewards }: RewardsPanelProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(20,15,36,0.92),rgba(13,10,25,0.96))] p-4 shadow-[0_20px_50px_rgba(3,6,20,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-amber-200/70">
            Reward Vault
          </p>
          <h2 className="mt-1 text-xl font-black text-white">Mis botines</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/45">
            Total
          </p>
          <p className="mt-1 text-2xl font-black text-amber-200">{rewards.length}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FLAVOR_LEGEND.map((item) => (
          <span
            key={item.label}
            className="shrink-0 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[0.72rem] font-bold text-white/80 shadow-sm backdrop-blur-sm"
          >
            {item.label}
          </span>
        ))}
      </div>

      {rewards.length === 0 ? (
        <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/14 bg-white/4 px-4 py-5 text-sm leading-relaxed text-white/64">
          Todavía no cae nada al cofre. Pisa casillas con iconos para desbloquear premios reales y
          eventos más jugosos.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {rewards.map((reward) => {
            const meta = REWARD_LABELS[reward.id]
            return (
              <article
                key={`${reward.id}-${reward.unlockedAt}`}
                className="rounded-[1.35rem] border border-amber-200/12 bg-[linear-gradient(135deg,rgba(255,198,92,0.16),rgba(255,255,255,0.05))] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
              >
                <h3 className="text-sm font-black text-white">{meta?.title ?? reward.id}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/68">
                  {meta?.description ?? 'Premio guardado en este dispositivo.'}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

import { useState } from 'react'
import { Board } from './components/Board'
import { ChallengeModal } from './components/ChallengeModal'
import { FlavorPickerModal } from './components/FlavorPickerModal'
import { FlavorShowcase } from './components/FlavorShowcase'
import { GameBackdrop } from './components/GameBackdrop'
import { PassportPanel } from './components/PassportPanel'
import { RewardsPanel } from './components/RewardsPanel'
import { SwapModal } from './components/SwapModal'
import { WheelSpinner } from './components/WheelSpinner'
import type { CookieCount, GameConfig, GameMode } from './types/game'
import { useGameState } from './hooks/useGameState'

function buildWhatsAppUrl(): string {
  const phone = (import.meta.env.VITE_WHATSAPP_PHONE ?? '5490000000000').replace(/\D/g, '')
  const message = encodeURIComponent(
    'Hola Impulse Cookies 👋 Terminé CookieLand y quiero reclamar mi premio / hacer un pedido.',
  )
  return `https://wa.me/${phone}?text=${message}`
}

function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/6 px-4 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff3c4,#f4bf53_60%,#8a4916)] text-xl shadow-lg">
        🍪
      </span>
      <div>
        <p className="text-left text-[0.68rem] font-black uppercase tracking-[0.28em] text-amber-200/80">
          Impulse
        </p>
        <h1 className="text-left text-[2.15rem] font-black leading-none text-white">CookieLand</h1>
      </div>
    </div>
  )
}

const RULES_BLURB = `¿Cómo se juega?

CookieLand se juega con 6 a 9 galletas.

1. Elige tus sabores.
2. Gira la rueda.
3. Avanza por el tablero.
4. Si caes en una galleta, toma un bocado.
5. Si pasas por una galleta pero no caes en ella, no la probaste.
6. Marca cada sabor en tu Pasaporte.
7. Para ganar, llega a META con suficientes sabores probados.

Bocado oficial: tamaño de una moneda grande.`

function HomeScreen({
  rewardsCount,
  initialNames,
  initialConfig,
  onSaveFull,
  onStart,
}: {
  rewardsCount: number
  initialNames: string[]
  initialConfig: GameConfig
  onSaveFull: (payload: {
    names: string[]
    cookieCount: CookieCount
    mode: GameMode
    weeklyLabels: GameConfig['weeklyLabels']
  }) => void
  onStart: () => void
}) {
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: 4 }, (_, index) => initialNames[index] ?? ''),
  )
  const [cookieCount, setCookieCount] = useState<CookieCount>(initialConfig.cookieCount)
  const [mode, setMode] = useState<GameMode>(initialConfig.mode)
  const [weeklyLabels, setWeeklyLabels] = useState(initialConfig.weeklyLabels)

  const weeklySlots = cookieCount - 5

  return (
    <div className="relative z-[1] flex min-h-dvh flex-col gap-4 px-4 pb-[max(1.4rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <BrandMark />

      <section className="overflow-hidden rounded-[2.4rem] border border-white/12 bg-[linear-gradient(160deg,rgba(19,17,40,0.94),rgba(42,22,64,0.9))] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.38)]">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.3em] text-amber-200/75">CookieLand Impulse</p>
        <h2 className="mt-3 text-[1.65rem] font-black leading-[1.05] text-white">
          Gira la rueda. Avanza por el camino. Prueba sabores. Completa tu pasaporte.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/72">
          Entre más galletas tengas, más divertido se vuelve el camino. Juega con 6, 7, 8 o 9 sabores.
        </p>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(20,15,36,0.92),rgba(13,10,25,0.96))] p-4 shadow-[0_20px_50px_rgba(3,6,20,0.35)]">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-amber-200/70">Jugadores</p>
        <h2 className="mt-1 text-xl font-black text-white">Nombres (2 a 4)</h2>
        <div className="mt-4 grid gap-3">
          {names.map((name, index) => (
            <label
              key={`player-input-${index + 1}`}
              className="rounded-[1.3rem] border border-white/10 bg-white/6 px-4 py-3"
            >
              <span className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/48">
                Jugador {index + 1}
              </span>
              <input
                value={name}
                onChange={(event) => {
                  const next = [...names]
                  next[index] = event.target.value
                  setNames(next)
                }}
                placeholder={`Nombre ${index + 1}`}
                className="mt-2 w-full border-0 bg-transparent p-0 text-base font-bold text-white outline-none placeholder:text-white/28"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(20,15,36,0.92),rgba(13,10,25,0.96))] p-4 shadow-[0_20px_50px_rgba(3,6,20,0.35)]">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-amber-200/70">Caja y modo</p>
        <h2 className="mt-1 text-xl font-black text-white">6 a 9 galletas</h2>
        <p className="mt-2 text-sm text-white/68">CookieLand funciona con 6 a 9 galletas.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {([6, 7, 8, 9] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCookieCount(n)}
              className={[
                'min-h-11 min-w-[3.2rem] rounded-full border px-4 text-sm font-black',
                cookieCount === n
                  ? 'border-amber-200/50 bg-amber-200/20 text-amber-100'
                  : 'border-white/12 bg-white/6 text-white/80',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/48">Modo</p>
        <div className="mt-2 grid gap-2">
          <button
            type="button"
            onClick={() => setMode('familiar')}
            className={[
              'rounded-[1.2rem] border px-4 py-3 text-left text-sm font-bold',
              mode === 'familiar' ? 'border-amber-200/45 bg-amber-200/15 text-white' : 'border-white/10 text-white/75',
            ].join(' ')}
          >
            Familiar — objetivo según caja (5–7 sabores)
          </button>
          <button
            type="button"
            onClick={() => setMode('degustacionTotal')}
            className={[
              'rounded-[1.2rem] border px-4 py-3 text-left text-sm font-bold',
              mode === 'degustacionTotal'
                ? 'border-amber-200/45 bg-amber-200/15 text-white'
                : 'border-white/10 text-white/75',
            ].join(' ')}
          >
            Degustación total — todos los sabores de la caja
          </button>
        </div>
        <p className="mt-4 text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/48">
          Nombres reales weekly ({weeklySlots} activos)
        </p>
        <div className="mt-2 grid gap-2">
          {Array.from({ length: weeklySlots }, (_, i) => i + 1).map((num) => {
            const key = `weekly${num}` as keyof typeof weeklyLabels
            return (
              <label key={key} className="rounded-[1.1rem] border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-white/45">
                  Weekly #{num}
                </span>
                <input
                  value={weeklyLabels[key]}
                  onChange={(e) => setWeeklyLabels((w) => ({ ...w, [key]: e.target.value }))}
                  className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-bold text-white outline-none"
                  placeholder={`Nombre del sabor ${num}`}
                />
              </label>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() =>
            onSaveFull({
              names,
              cookieCount,
              mode,
              weeklyLabels,
            })
          }
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-[1.3rem] border border-white/12 bg-white/8 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          Guardar jugadores y caja
        </button>
      </section>

      <section className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/75 whitespace-pre-line">
        {RULES_BLURB}
      </section>

      <FlavorShowcase />

      <div className="space-y-3">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/72 backdrop-blur-sm">
          Premios guardados en este dispositivo:{' '}
          <span className="font-black text-amber-200">{rewardsCount}</span>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-14 w-full items-center justify-center rounded-[1.5rem] border border-amber-200/30 bg-[linear-gradient(180deg,#ffe08a,#ffb83d_45%,#ef7b25)] px-8 py-4 text-base font-black uppercase tracking-[0.16em] text-[#421708] shadow-[0_12px_0_rgba(133,61,9,0.92),0_22px_34px_rgba(0,0,0,0.32)] transition active:translate-y-[2px] active:shadow-[0_8px_0_rgba(133,61,9,0.92),0_16px_24px_rgba(0,0,0,0.28)]"
        >
          Entrar al juego
        </button>
      </div>
    </div>
  )
}

function WinScreen({
  rewardsCount,
  winnerName,
  onReset,
}: {
  rewardsCount: number
  winnerName: string | null
  onReset: () => void
}) {
  const waUrl = buildWhatsAppUrl()

  return (
    <div className="relative z-[1] flex min-h-dvh flex-col justify-center px-5 pb-[max(1.4rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <section className="overflow-hidden rounded-[2.4rem] border border-white/14 bg-[linear-gradient(160deg,rgba(29,18,45,0.96),rgba(14,10,28,0.98))] p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-[radial-gradient(circle_at_35%_30%,#fff0bf,#efb64d_62%,#8b4816)] text-4xl shadow-lg">
          🎁
        </div>
        <p className="mt-5 text-[0.68rem] font-black uppercase tracking-[0.28em] text-amber-200/70">META</p>
        <h2 className="mt-2 text-[2.2rem] font-black leading-none text-white">
          {winnerName ? `${winnerName} ganó` : '¡Victoria!'}
        </h2>
        <p className="mt-4 text-[1rem] leading-relaxed text-white/72">
          Llegaste a la casilla 45 con tu Pasaporte completo según el modo elegido.
        </p>

        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/74">
          Recompensas desbloqueadas: <span className="font-black text-amber-200">{rewardsCount}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-14 items-center justify-center rounded-[1.45rem] border border-amber-200/30 bg-[linear-gradient(180deg,#ffd97a,#ffaf3f_45%,#ec6e22)] px-6 py-4 text-base font-black uppercase tracking-[0.14em] text-[#401607] shadow-[0_10px_0_rgba(130,59,9,0.92)]"
          >
            Reclamar por WhatsApp
          </a>
          <button
            type="button"
            onClick={onReset}
            className="min-h-12 rounded-[1.35rem] border border-white/14 bg-white/8 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            Volver a jugar
          </button>
        </div>
      </section>
    </div>
  )
}

function App() {
  const {
    persist,
    challengeCard,
    flavorPick,
    swapOpen,
    isAnimating,
    spinWheel,
    closeChallengeModal,
    applyFlavorPick,
    cancelFlavorPick,
    applySwap,
    cancelSwap,
    updatePlayersAndConfig,
    goToPlaying,
    resetRun,
  } = useGameState()

  const rewardsCount = persist.unlockedRewards.length
  const activePlayer = persist.players[persist.activePlayerIndex]

  if (persist.screen === 'home') {
    return (
      <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden">
        <GameBackdrop />
        <HomeScreen
          rewardsCount={rewardsCount}
          initialNames={persist.players.map((p) => p.name)}
          initialConfig={persist.config}
          onSaveFull={updatePlayersAndConfig}
          onStart={goToPlaying}
        />
      </div>
    )
  }

  if (persist.screen === 'won') {
    return (
      <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden">
        <GameBackdrop />
        <WinScreen rewardsCount={rewardsCount} winnerName={persist.winnerName} onReset={resetRun} />
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-dvh max-w-md overflow-hidden">
      <GameBackdrop />

      <div className="relative z-[1] flex min-h-dvh flex-col gap-4 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.9rem,env(safe-area-inset-top))]">
        <header className="overflow-hidden rounded-[1.9rem] border border-white/12 bg-white/6 px-4 py-4 shadow-[0_20px_50px_rgba(6,9,30,0.24)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-amber-200/72">
                CookieLand
              </p>
              <h1 className="mt-1 text-2xl font-black text-white">Partida</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-right">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/45">Turno</p>
              <p className="mt-1 text-lg font-black text-amber-200">{activePlayer?.name}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <article className="rounded-[1.2rem] border border-white/10 bg-white/6 px-3 py-2.5">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/45">Último giro</p>
              <p className="mt-1 line-clamp-2 text-sm font-black text-white">{persist.lastSpinLabel ?? '—'}</p>
            </article>
            <article className="rounded-[1.2rem] border border-white/10 bg-white/6 px-3 py-2.5">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.22em] text-white/45">Giros</p>
              <p className="mt-1 text-xl font-black text-white">{persist.spinCount}</p>
            </article>
          </div>
        </header>

        {activePlayer ? (
          <PassportPanel
            player={activePlayer}
            cookieCount={persist.config.cookieCount}
            mode={persist.config.mode}
            weeklyLabels={persist.config.weeklyLabels}
          />
        ) : null}

        <section className="overflow-hidden rounded-[1.8rem] border border-white/12 bg-white/6 px-4 py-3 backdrop-blur-md">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/42">Mesa</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {persist.players.map((player, index) => (
              <div
                key={player.id}
                className={[
                  'min-w-[9rem] rounded-[1.25rem] border px-3 py-3',
                  index === persist.activePlayerIndex
                    ? 'border-amber-200/35 bg-[linear-gradient(180deg,rgba(255,204,107,0.18),rgba(255,255,255,0.08))]'
                    : 'border-white/10 bg-white/6',
                ].join(' ')}
              >
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: player.color }} />
                  <p className="text-sm font-black text-white">{player.name}</p>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
                  Casilla lógica {player.position}
                </p>
                <p className="mt-1 text-xs text-white/68">Escudos {player.shields}</p>
              </div>
            ))}
          </div>
        </section>

        <WheelSpinner
          onSpin={spinWheel}
          disabled={isAnimating}
          lastSpinLabel={persist.lastSpinLabel}
          hint={persist.rollHint}
          shields={activePlayer?.shields ?? 0}
          activePlayerName={activePlayer?.name ?? 'Jugador'}
        />

        <Board
          players={persist.players}
          activePlayerIndex={persist.activePlayerIndex}
          isAnimating={isAnimating}
        />
        <RewardsPanel rewards={persist.unlockedRewards} />
      </div>

      <ChallengeModal card={challengeCard} onOutcome={() => closeChallengeModal()} />
      {flavorPick ? (
        <FlavorPickerModal
          kind={flavorPick.kind}
          allowed={flavorPick.allowed}
          weeklyLabels={persist.config.weeklyLabels}
          onPick={applyFlavorPick}
          onCancel={cancelFlavorPick}
        />
      ) : null}
      <SwapModal
        open={swapOpen}
        players={persist.players}
        currentIndex={persist.activePlayerIndex}
        onPick={applySwap}
        onCancel={cancelSwap}
      />
    </div>
  )
}

export default App

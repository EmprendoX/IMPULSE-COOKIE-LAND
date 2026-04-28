import { useMemo, useState } from 'react'
import { WHEEL_SEGMENT_ANGLE, WHEEL_SEGMENTS } from '../data/wheelSegments'

function describeHint(hint: string | null): string {
  return hint ?? 'Gira la rueda, avanza y prueba sabores. Si brincas una galleta, no la probaste.'
}

export interface WheelSpinnerProps {
  onSpin: (segmentIndex: number) => void
  disabled: boolean
  lastSpinLabel: string | null
  hint: string | null
  shields: number
  activePlayerName: string
}

export function WheelSpinner({
  onSpin,
  disabled,
  lastSpinLabel,
  hint,
  shields,
  activePlayerName,
}: WheelSpinnerProps) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayLabel, setDisplayLabel] = useState<string>('Gira')

  const wheelStyle = useMemo(() => {
    const stops = WHEEL_SEGMENTS.map((segment, index) => {
      const start = (index / WHEEL_SEGMENTS.length) * 100
      const end = ((index + 1) / WHEEL_SEGMENTS.length) * 100
      return `${segment.color} ${start}% ${end}%`
    })
    return {
      background: `conic-gradient(from -90deg, ${stops.join(', ')})`,
      transform: `rotate(${rotation}deg)`,
      transition: isSpinning ? 'transform 3.2s cubic-bezier(.12,.87,.13,1)' : 'none',
    }
  }, [isSpinning, rotation])

  const centerLabel = isSpinning ? displayLabel : lastSpinLabel === null ? 'Gira' : lastSpinLabel

  const handleSpin = () => {
    if (disabled || isSpinning) return

    const index = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    const segment = WHEEL_SEGMENTS[index]!
    const extraTurns = 6 * 360
    const landingOffset = 360 - index * WHEEL_SEGMENT_ANGLE - WHEEL_SEGMENT_ANGLE / 2
    const nextRotation = rotation + extraTurns + landingOffset

    setIsSpinning(true)
    setDisplayLabel(segment.shortLabel)
    setRotation(nextRotation)

    window.setTimeout(() => {
      setIsSpinning(false)
      onSpin(index)
    }, 3200)
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(20,16,45,0.96),rgba(12,10,28,0.98))] px-4 py-5 shadow-[0_24px_60px_rgba(3,6,20,0.42)]">
      <div className="absolute inset-x-6 top-0 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,220,138,0.3),transparent_68%)] blur-2xl" />

      <div className="relative z-[1] flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-amber-200/70">
            Rueda CookieLand
          </p>
          <h2 className="mt-1 text-xl font-black text-white">Fortuna dulce</h2>
          <p className="mt-2 max-w-[14rem] text-sm leading-relaxed text-white/70">{describeHint(hint)}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200/80">
            Turno de {activePlayerName}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right backdrop-blur-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/45">
            Escudos
          </p>
          <p className="mt-1 text-2xl font-black text-amber-200">{shields}</p>
        </div>
      </div>

      <div className="relative z-[1] mt-5 flex items-center justify-center">
        <div className="absolute top-0 z-10 h-0 w-0 -translate-y-1 border-x-[14px] border-t-[0] border-b-[24px] border-x-transparent border-b-amber-300 drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]" />

        <div className="relative flex h-[18.5rem] w-[18.5rem] max-w-full items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.28),transparent_40%),linear-gradient(135deg,#f7d575,#8b4f18)] p-[10px] shadow-[0_16px_34px_rgba(0,0,0,0.4)]">
            <div
              className="relative h-full w-full rounded-full border-[6px] border-[#3f2007] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.18)]"
              style={wheelStyle}
            >
              {WHEEL_SEGMENTS.map((segment, index) => {
                const angle = index * WHEEL_SEGMENT_ANGLE + WHEEL_SEGMENT_ANGLE / 2
                return (
                  <span
                    key={segment.id}
                    className="absolute left-1/2 top-1/2 origin-center text-[0.58rem] font-black uppercase tracking-[0.06em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-6.3rem) rotate(${90}deg)`,
                    }}
                  >
                    {segment.shortLabel}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="absolute flex h-[5.6rem] w-[5.6rem] flex-col items-center justify-center rounded-full border-[6px] border-[#462104] bg-[radial-gradient(circle_at_50%_35%,#fff0bf,#df8e3f_65%,#8d4211)] text-center shadow-[0_12px_24px_rgba(0,0,0,0.35)]">
            <span className="text-[0.58rem] font-black uppercase tracking-[0.24em] text-[#6b2c08]">
              Giro
            </span>
            <span className="mt-1 max-w-[4.5rem] truncate px-1 text-sm font-black leading-tight text-[#311106]">
              {centerLabel}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSpin}
        disabled={disabled || isSpinning}
        className="relative z-[1] mt-5 flex min-h-14 w-full items-center justify-center rounded-[1.4rem] border border-amber-200/30 bg-[linear-gradient(180deg,#ffe08a,#ffb83d_45%,#ef7b25)] px-6 py-4 text-base font-black uppercase tracking-[0.14em] text-[#421708] shadow-[0_10px_0_rgba(133,61,9,0.9),0_22px_34px_rgba(0,0,0,0.32)] transition disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-[2px] active:shadow-[0_7px_0_rgba(133,61,9,0.9),0_16px_24px_rgba(0,0,0,0.28)]"
      >
        {isSpinning ? 'Girando...' : 'Girar rueda'}
      </button>
    </section>
  )
}

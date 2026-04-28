import { getSquareById } from '../data/boardSquares'

const COLS = 9
const ROWS = 5

type NodePosition = {
  id: number
  x: number
  y: number
  icon: string
  highlight: boolean
}

function iconForCell(id: number): string {
  const sq = getSquareById(id)
  if (!sq) return '·'
  switch (sq.kind) {
    case 'start':
      return '▶'
    case 'finish':
      return '★'
    case 'cookie':
      return '🍪'
    case 'challenge':
      return '🎯'
    case 'boost':
      return '⚡'
    case 'swap':
      return '⇄'
    case 'extraTurn':
      return '②'
    case 'block':
      return '🚫'
    case 'shield':
      return '🛡'
    default:
      return '·'
  }
}

function buildPathNodes(): NodePosition[] {
  const items: NodePosition[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = row * COLS + (row % 2 === 0 ? col + 1 : COLS - col)
      const x = 7 + col * 10.8
      const y = 12 + row * 20
      const square = getSquareById(id)
      const highlight =
        Boolean(square) &&
        square!.kind !== 'neutral' &&
        square!.kind !== 'start' &&
        square!.kind !== 'finish'
      items.push({
        id,
        x,
        y,
        icon: iconForCell(id),
        highlight,
      })
    }
  }

  return items
}

const PATH_NODES = buildPathNodes()

function buildRibbonPath(nodes: NodePosition[]): string {
  return nodes
    .map((node, index) => `${index === 0 ? 'M' : 'L'} ${node.x} ${node.y}`)
    .join(' ')
}

const RIBBON_PATH = buildRibbonPath(PATH_NODES)

export interface BoardProps {
  players: Array<{
    id: string
    name: string
    color: string
    position: number
  }>
  activePlayerIndex: number
  isAnimating: boolean
}

export function Board({ players, activePlayerIndex, isAnimating }: BoardProps) {
  const leadPosition = Math.max(...players.map((player) => player.position))
  const progress = Math.round((leadPosition / 45) * 100)
  const activePlayer = players[activePlayerIndex]

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,250,237,0.98),rgba(255,239,196,0.96))] p-4 shadow-[0_24px_50px_rgba(72,39,15,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-[#9b6b42]">
            Tablero
          </p>
          <h2 className="mt-1 text-xl font-black text-[#4f260e]">CookieLand</h2>
          <p className="mt-1 max-w-[16rem] text-sm leading-relaxed text-[#754929]">
            Sin números en el camino: solo iconos. La app lleva la posición por dentro (1–45).
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 px-3 py-2 text-right shadow-[inset_0_0_0_1px_rgba(125,84,41,0.12)]">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8b633a]">
            Avance
          </p>
          <p className="mt-1 text-2xl font-black text-[#4f260e]">{progress}%</p>
        </div>
      </div>

      <div className="relative mt-4 h-[30rem] rounded-[1.8rem] border border-[#5d331533] bg-[linear-gradient(180deg,#8cd2ff_0%,#bde6ff_24%,#d7f2b3_25%,#98df8a_44%,#c9a070_45%,#ead8b2_100%)] px-3 py-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.6)]">
        <div className="absolute inset-x-3 top-3 h-20 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.58),transparent_70%)] blur-xl" />

        <div className="absolute left-3 top-4 rounded-[1.2rem] border border-white/70 bg-[#8b3d2bcc] px-3 py-2 text-white shadow-lg">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-amber-100/85">
            Salida
          </p>
          <p className="text-sm font-bold">Casita</p>
        </div>

        <div className="absolute bottom-5 right-3 rounded-[1.2rem] border border-amber-100/60 bg-[#723413d6] px-3 py-2 text-right text-white shadow-lg">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-amber-100/85">
            Meta
          </p>
          <p className="text-sm font-bold">Casilla 45</p>
        </div>

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden
          preserveAspectRatio="none"
        >
          <path
            d={RIBBON_PATH}
            fill="none"
            stroke="#7a3e16"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.25"
          />
          <path
            d={RIBBON_PATH}
            fill="none"
            stroke="url(#road)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={RIBBON_PATH}
            fill="none"
            stroke="#fff5db"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0.2 5.8"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="road" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5e78" />
              <stop offset="16%" stopColor="#ff9f43" />
              <stop offset="34%" stopColor="#ffd166" />
              <stop offset="50%" stopColor="#58d68d" />
              <stop offset="68%" stopColor="#51b9ff" />
              <stop offset="84%" stopColor="#7c83fd" />
              <stop offset="100%" stopColor="#f78fb3" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0">
          {PATH_NODES.map((node) => {
            const playersHere = players.filter((player) => player.position === node.id)
            const active = activePlayer?.position === node.id
            const isStart = node.id === 1
            const isGoal = node.id === 45

            return (
              <div
                key={node.id}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {node.highlight ? (
                  <div className="absolute left-1/2 top-[-1.55rem] -translate-x-1/2 rounded-full bg-[#1f1126dd] px-2 py-1 text-[0.62rem] font-black text-white shadow-lg">
                    {node.icon}
                  </div>
                ) : null}

                <div
                  className={[
                    'relative flex items-center justify-center rounded-full border-[3px] font-black shadow-[0_8px_16px_rgba(61,33,13,0.22)] transition-all duration-300',
                    node.highlight || isStart || isGoal
                      ? 'h-[2.55rem] w-[2.55rem] border-[#774218] bg-[radial-gradient(circle_at_35%_30%,#fff7de,#f3cd94_62%,#be8145)] text-[#4c2208]'
                      : 'h-[2.1rem] w-[2.1rem] border-[#8a5a30] bg-[radial-gradient(circle_at_35%_30%,#fff8ec,#f0ddbe_60%,#d8b48a)] text-[#684223]',
                    active ? 'scale-[1.18] ring-4 ring-[#fff2a5] ring-offset-4 ring-offset-transparent' : '',
                    isAnimating && active ? 'motion-safe:animate-bounce' : '',
                  ].join(' ')}
                >
                  {isStart ? '▶' : isGoal ? '★' : node.icon}

                  {active ? (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#2f1707] px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-amber-100 shadow-lg">
                      Tú
                    </span>
                  ) : null}
                </div>

                {playersHere.length > 0 ? (
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 translate-y-5 gap-1">
                    {playersHere.map((player) => (
                      <span
                        key={player.id}
                        className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white shadow-md"
                        style={{ backgroundColor: player.color }}
                        title={player.name}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

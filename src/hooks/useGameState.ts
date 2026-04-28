import { useCallback, useEffect, useRef, useState } from 'react'
import { getSquareById } from '../data/boardSquares'
import type { ChallengeCard } from '../data/challenges'
import { randomChallenge } from '../data/challenges'
import {
  activeFlavorIds,
  addUnique,
  defaultGameConfig,
  flavorLabel,
  targetFlavorCount,
} from '../data/flavors'
import type { WheelFollowUp } from '../data/wheelSegments'
import { WHEEL_SEGMENTS } from '../data/wheelSegments'
import {
  clampBoard,
  collectMissedFromPath,
  effectiveCookieFlavor,
  getNextPlayerIndex,
  nearestPendingCookieBehind,
} from '../lib/gameEngine'
import { defaultPersist, loadGame, normalizePlayers, saveGame } from '../lib/storage'
import type { BoardSquare, FlavorBlockState, FlavorId, GamePersist, GamePlayer } from '../types/game'
import { BOARD_SIZE } from '../types/game'

const STEP_MS = 85
const META_HINT =
  'Llegaste a META, pero todavía te faltan sabores. Regresa al sabor pendiente más cercano.'

function withUpdatedPlayer(
  state: GamePersist,
  playerIndex: number,
  updater: (player: GamePlayer) => GamePlayer,
): GamePersist {
  return {
    ...state,
    players: state.players.map((player, index) =>
      index === playerIndex ? updater(player) : player,
    ),
  }
}

function maybeClearBlockOnAdvance(p: GamePersist, leavingPlayerIndex: number): GamePersist {
  if (!p.flavorBlock) return p
  const nextIdx = getNextPlayerIndex(p.players, leavingPlayerIndex)
  if (nextIdx === p.flavorBlock.ownerPlayerIndex) {
    return { ...p, flavorBlock: null }
  }
  return p
}

function tryTasteCookie(
  player: GamePlayer,
  square: BoardSquare,
  config: GamePersist['config'],
  block: FlavorBlockState | null,
): { player: GamePlayer; hint: string | null; openWildcard: boolean } {
  if (square.kind !== 'cookie' || !square.flavorId) {
    return { player, hint: null, openWildcard: false }
  }
  const eff = effectiveCookieFlavor(square, config.cookieCount)
  if (eff === 'wildcard') {
    return {
      player,
      hint: 'Comodín: elige un sabor activo que aún no tengas marcado.',
      openWildcard: true,
    }
  }
  if (eff === null) {
    return { player, hint: null, openWildcard: false }
  }
  const fid = eff
  if (block && block.flavorId === fid) {
    if (player.shields > 0) {
      return {
        player: {
          ...player,
          shields: player.shields - 1,
          tastedFlavorIds: addUnique(player.tastedFlavorIds, fid),
          missedFlavorIds: player.missedFlavorIds.filter((m) => m !== fid),
        },
        hint: `Escudo usado: probaste ${flavorLabel(fid, config.weeklyLabels)} a pesar del bloqueo.`,
        openWildcard: false,
      }
    }
    return {
      player,
      hint: `${flavorLabel(fid, config.weeklyLabels)} está bloqueado.`,
      openWildcard: false,
    }
  }
  if (player.skipNextBite) {
    return {
      player: { ...player, skipNextBite: false },
      hint: 'Perdiste este bocado por un reto.',
      openWildcard: false,
    }
  }
  if (player.tastedFlavorIds.includes(fid)) {
    return {
      player,
      hint: `Ya habías probado ${flavorLabel(fid, config.weeklyLabels)}. Mini bocado opcional.`,
      openWildcard: false,
    }
  }
  return {
    player: {
      ...player,
      tastedFlavorIds: addUnique(player.tastedFlavorIds, fid),
      missedFlavorIds: player.missedFlavorIds.filter((m) => m !== fid),
    },
    hint: `Pasaporte: ${flavorLabel(fid, config.weeklyLabels)}.`,
    openWildcard: false,
  }
}

export type FlavorPickKind =
  | 'rescue'
  | 'wildcard'
  | 'doubleCravingSecond'
  | 'blockWheel'
  | 'blockBoard'
  | 'metaFallback'

export interface FlavorPickState {
  kind: FlavorPickKind
  allowed: FlavorId[]
}

export function useGameState() {
  const [persist, setPersist] = useState<GamePersist>(() => loadGame())
  const [challengeCard, setChallengeCard] = useState<ChallengeCard | null>(null)
  const [flavorPick, setFlavorPick] = useState<FlavorPickState | null>(null)
  const [swapOpen, setSwapOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const animToken = useRef(0)
  const modalPlayerIndexRef = useRef<number | null>(null)
  /** Seguimiento de la rueda del giro actual (se consume al terminar la casilla) */
  const wheelFollowUpRef = useRef<WheelFollowUp>('none')

  useEffect(() => {
    saveGame(persist)
  }, [persist])

  useEffect(() => {
    if (!persist.rollHint) return undefined
    const t = window.setTimeout(() => {
      setPersist((p) => ({ ...p, rollHint: null }))
    }, 4000)
    return () => window.clearTimeout(t)
  }, [persist.rollHint])

  const animateSteps = useCallback((playerIndex: number, from: number, to: number, onDone: () => void) => {
    const token = ++animToken.current
    setIsAnimating(true)
    const target = clampBoard(to)
    let current = clampBoard(from)
    const step = target >= current ? 1 : -1

    const tick = () => {
      if (token !== animToken.current) return
      if (current === target) {
        setIsAnimating(false)
        onDone()
        return
      }
      current += step
      setPersist((p) =>
        withUpdatedPlayer(p, playerIndex, (player) => ({
          ...player,
          position: current,
        })),
      )
      window.setTimeout(tick, STEP_MS)
    }

    tick()
  }, [])

  const finishWin = useCallback((playerName: string) => {
    setPersist((p) => ({
      ...p,
      screen: 'won',
      rollHint: null,
      winnerName: playerName,
    }))
  }, [])

  const endTurnSmart = useCallback((playerIndex: number, rollHint?: string | null) => {
    setPersist((p) => {
      const pl = p.players[playerIndex]
      if (!pl) return p
      if (pl.extraTurn) {
        return {
          ...withUpdatedPlayer(p, playerIndex, (player) => ({ ...player, extraTurn: false })),
          rollHint: rollHint ?? `${pl.name} juega otra vez.`,
        }
      }
      let next = maybeClearBlockOnAdvance(p, playerIndex)
      next = {
        ...next,
        activePlayerIndex: getNextPlayerIndex(next.players, playerIndex),
        rollHint: rollHint ?? next.rollHint,
      }
      return next
    })
  }, [])

  const processWheelFollowUp = useCallback(
    (playerIndex: number, followUp: WheelFollowUp) => {
      if (followUp === 'none') {
        endTurnSmart(playerIndex, null)
        return
      }
      if (followUp === 'shield') {
        setPersist((p) => {
          const pl = p.players[playerIndex]
          if (!pl) return p
          return {
            ...withUpdatedPlayer(p, playerIndex, (player) => ({ ...player, shields: player.shields + 1 })),
            rollHint: `${pl.name} ganó un escudo por la rueda.`,
          }
        })
        endTurnSmart(playerIndex, null)
        return
      }
      if (followUp === 'challenge') {
        modalPlayerIndexRef.current = playerIndex
        setChallengeCard(randomChallenge())
        return
      }
      if (followUp === 'rescue') {
        setPersist((p) => {
          const player = p.players[playerIndex]
          if (!player) return p
          const allowed = activeFlavorIds(p.config.cookieCount).filter(
            (id) => !player.tastedFlavorIds.includes(id),
          )
          if (allowed.length === 0) {
            queueMicrotask(() => endTurnSmart(playerIndex, 'Rescate: ya tenías todos los sabores.'))
            return { ...p, rollHint: 'Rescate: sin sabores pendientes.' }
          }
          modalPlayerIndexRef.current = playerIndex
          queueMicrotask(() => setFlavorPick({ kind: 'rescue', allowed }))
          return p
        })
        return
      }
      if (followUp === 'block') {
        modalPlayerIndexRef.current = playerIndex
        setPersist((p) => {
          queueMicrotask(() =>
            setFlavorPick({
              kind: 'blockWheel',
              allowed: activeFlavorIds(p.config.cookieCount),
            }),
          )
          return p
        })
        return
      }
      if (followUp === 'doubleCraving') {
        setPersist((p) => {
          const player = p.players[playerIndex]
          if (!player) return p
          const allowed = [
            ...new Set([
              ...player.missedFlavorIds,
              ...activeFlavorIds(p.config.cookieCount).filter((id) => !player.tastedFlavorIds.includes(id)),
            ]),
          ]
          if (allowed.length === 0) {
            queueMicrotask(() => endTurnSmart(playerIndex, 'Antojo doble: no había segundo sabor.'))
            return p
          }
          modalPlayerIndexRef.current = playerIndex
          queueMicrotask(() => setFlavorPick({ kind: 'doubleCravingSecond', allowed }))
          return p
        })
      }
    },
    [endTurnSmart],
  )

  const finishSquareAndWheel = useCallback(
    (playerIndex: number) => {
      const fu = wheelFollowUpRef.current
      wheelFollowUpRef.current = 'none'
      processWheelFollowUp(playerIndex, fu)
    },
    [processWheelFollowUp],
  )

  const resolveFinishIncomplete = useCallback(
    (playerIndex: number) => {
      setPersist((b) => {
        const pl = b.players[playerIndex]!
        const back = nearestPendingCookieBehind(BOARD_SIZE, pl.tastedFlavorIds, b.config)
        if (back !== null) {
          queueMicrotask(() => endTurnSmart(playerIndex, null))
          return {
            ...withUpdatedPlayer({ ...b, rollHint: META_HINT }, playerIndex, (p) => ({ ...p, position: back })),
          }
        }
        const allowed = activeFlavorIds(b.config.cookieCount).filter((id) => !pl.tastedFlavorIds.includes(id))
        modalPlayerIndexRef.current = playerIndex
        queueMicrotask(() => setFlavorPick({ kind: 'metaFallback', allowed }))
        return { ...b, rollHint: META_HINT }
      })
    },
    [endTurnSmart],
  )

  const resolveLand = useCallback(function resolveLand(
    playerIndex: number,
    pos: number,
    opts: { allowBoostChain: boolean },
  ) {
      setPersist((base) => {
        const sq = getSquareById(pos)
        const player = base.players[playerIndex]
        if (!sq || !player) return base

        let next = base
        let pl = player

        if (sq.kind === 'finish') {
          const need = targetFlavorCount(next.config.mode, next.config.cookieCount)
          if (pl.tastedFlavorIds.length >= need) {
            queueMicrotask(() => {
              wheelFollowUpRef.current = 'none'
              finishWin(pl.name)
            })
            return next
          }
          queueMicrotask(() => {
            wheelFollowUpRef.current = 'none'
            resolveFinishIncomplete(playerIndex)
          })
          return next
        }

        if (sq.kind === 'cookie') {
          const t = tryTasteCookie(pl, sq, next.config, next.flavorBlock)
          pl = t.player
          next = withUpdatedPlayer(next, playerIndex, () => pl)
          if (t.hint) next = { ...next, rollHint: t.hint }
          if (t.openWildcard) {
            queueMicrotask(() => {
              modalPlayerIndexRef.current = playerIndex
              setFlavorPick({
                kind: 'wildcard',
                allowed: activeFlavorIds(next.config.cookieCount).filter((id) => !pl.tastedFlavorIds.includes(id)),
              })
            })
            return next
          }
          queueMicrotask(() => finishSquareAndWheel(playerIndex))
          return next
        }

        if (sq.kind === 'shield') {
          pl = { ...pl, shields: pl.shields + 1 }
          next = withUpdatedPlayer(next, playerIndex, () => pl)
          next = { ...next, rollHint: `${pl.name} ganó un escudo.` }
          queueMicrotask(() => finishSquareAndWheel(playerIndex))
          return next
        }

        if (sq.kind === 'extraTurn') {
          pl = { ...pl, extraTurn: true }
          next = withUpdatedPlayer(next, playerIndex, () => pl)
          next = { ...next, rollHint: `${pl.name}: ¡doble turno!` }
          queueMicrotask(() => finishSquareAndWheel(playerIndex))
          return next
        }

        if (sq.kind === 'boost' && opts.allowBoostChain) {
          const pos2 = clampBoard(pos + 2)
          queueMicrotask(() => {
            setPersist((b2) => ({ ...b2, rollHint: 'Boost +2: ¡dos casillas más!' }))
            animateSteps(playerIndex, pos, pos2, () => {
              setPersist((b3) => withUpdatedPlayer(b3, playerIndex, (pp) => ({ ...pp, position: pos2 })))
              queueMicrotask(() => resolveLand(playerIndex, pos2, { allowBoostChain: false }))
            })
          })
          return withUpdatedPlayer(next, playerIndex, () => pl)
        }

        if (sq.kind === 'swap') {
          queueMicrotask(() => {
            modalPlayerIndexRef.current = playerIndex
            setSwapOpen(true)
          })
          return withUpdatedPlayer(next, playerIndex, () => pl)
        }

        if (sq.kind === 'block') {
          queueMicrotask(() => {
            modalPlayerIndexRef.current = playerIndex
            setFlavorPick({ kind: 'blockBoard', allowed: activeFlavorIds(next.config.cookieCount) })
          })
          return withUpdatedPlayer(next, playerIndex, () => pl)
        }

        if (sq.kind === 'challenge') {
          queueMicrotask(() => {
            modalPlayerIndexRef.current = playerIndex
            setChallengeCard(randomChallenge())
          })
          return withUpdatedPlayer(next, playerIndex, () => pl)
        }

        queueMicrotask(() => finishSquareAndWheel(playerIndex))
        return withUpdatedPlayer(next, playerIndex, () => pl)
      })
  }, [animateSteps, finishSquareAndWheel, finishWin, resolveFinishIncomplete])

  const spinWheel = useCallback(
    (segmentIndex: number) => {
      if (isAnimating) return
      if (persist.screen !== 'playing') return
      const playerIndex = persist.activePlayerIndex
      const activePlayer = persist.players[playerIndex]
      if (!activePlayer) return

      const segment = WHEEL_SEGMENTS[segmentIndex]
      if (!segment) return

      const from = activePlayer.position
      const tentative = from + segment.steps
      if (tentative > BOARD_SIZE) {
        setPersist((p) => ({
          ...p,
          lastSpinLabel: segment.label,
          spinCount: p.spinCount + 1,
          rollHint: `${activePlayer.name} necesita un giro exacto para la META (45).`,
        }))
        wheelFollowUpRef.current = 'none'
        endTurnSmart(playerIndex, null)
        return
      }

      const { player: withMissed, hints } = collectMissedFromPath(activePlayer, from, tentative, persist.config)
      const hintJoin = hints.length ? hints.join(' ') : null
      wheelFollowUpRef.current = segment.followUp

      setPersist((p) =>
        withUpdatedPlayer(
          {
            ...p,
            lastSpinLabel: segment.label,
            spinCount: p.spinCount + 1,
            rollHint: hintJoin ?? p.rollHint,
          },
          playerIndex,
          () => withMissed,
        ),
      )

      animateSteps(playerIndex, from, tentative, () => {
        resolveLand(playerIndex, tentative, { allowBoostChain: true })
      })
    },
    [
      animateSteps,
      endTurnSmart,
      isAnimating,
      persist.activePlayerIndex,
      persist.config,
      persist.players,
      persist.screen,
      resolveLand,
    ],
  )

  const closeChallengeModal = useCallback(() => {
    setChallengeCard(null)
    const idx = modalPlayerIndexRef.current ?? persist.activePlayerIndex
    finishSquareAndWheel(idx)
  }, [finishSquareAndWheel, persist.activePlayerIndex])

  const applyFlavorPick = useCallback(
    (flavorId: FlavorId) => {
      if (!flavorPick) return
      const idx = modalPlayerIndexRef.current ?? persist.activePlayerIndex
      const kind = flavorPick.kind

      if (kind === 'blockWheel' || kind === 'blockBoard') {
        setPersist((p) => ({
          ...p,
          flavorBlock: { flavorId, ownerPlayerIndex: idx },
          rollHint: `Bloqueo: ${flavorLabel(flavorId, p.config.weeklyLabels)}.`,
        }))
        setFlavorPick(null)
        finishSquareAndWheel(idx)
        return
      }

      setPersist((p) =>
        withUpdatedPlayer(p, idx, (pl) => ({
          ...pl,
          tastedFlavorIds: addUnique(pl.tastedFlavorIds, flavorId),
          missedFlavorIds: pl.missedFlavorIds.filter((m) => m !== flavorId),
        })),
      )
      setFlavorPick(null)

      if (kind === 'metaFallback') {
        endTurnSmart(idx, null)
        return
      }
      if (kind === 'doubleCravingSecond') {
        wheelFollowUpRef.current = 'none'
        endTurnSmart(idx, 'Segundo bocado del Antojo doble.')
        return
      }
      finishSquareAndWheel(idx)
    },
    [endTurnSmart, finishSquareAndWheel, flavorPick, persist.activePlayerIndex],
  )

  const cancelFlavorPick = useCallback(() => {
    setFlavorPick(null)
    const idx = modalPlayerIndexRef.current ?? persist.activePlayerIndex
    wheelFollowUpRef.current = 'none'
    endTurnSmart(idx, null)
  }, [endTurnSmart, persist.activePlayerIndex])

  const applySwap = useCallback(
    (otherIndex: number) => {
      const idx = modalPlayerIndexRef.current ?? persist.activePlayerIndex
      setPersist((p) => {
        const a = p.players[idx]
        const b = p.players[otherIndex]
        if (!a || !b || idx === otherIndex) return p
        const posA = a.position
        const posB = b.position
        return {
          ...p,
          players: p.players.map((pl, i) => {
            if (i === idx) return { ...pl, position: posB }
            if (i === otherIndex) return { ...pl, position: posA }
            return pl
          }),
          rollHint: `${a.name} e ${b.name} intercambiaron posiciones.`,
        }
      })
      setSwapOpen(false)
      finishSquareAndWheel(idx)
    },
    [finishSquareAndWheel, persist.activePlayerIndex],
  )

  const cancelSwap = useCallback(() => {
    setSwapOpen(false)
    const idx = modalPlayerIndexRef.current ?? persist.activePlayerIndex
    finishSquareAndWheel(idx)
  }, [finishSquareAndWheel, persist.activePlayerIndex])

  const updatePlayersAndConfig = useCallback(
    (payload: {
      names: string[]
      cookieCount: GamePersist['config']['cookieCount']
      mode: GamePersist['config']['mode']
      weeklyLabels: GamePersist['config']['weeklyLabels']
    }) => {
      const cleaned = payload.names.map((n) => n.trim()).filter(Boolean)
      if (cleaned.length < 2) return
      let prevRewards: GamePersist['unlockedRewards'] = []
      try {
        prevRewards = loadGame().unlockedRewards
      } catch {
        prevRewards = []
      }
      setPersist(() => ({
        ...defaultPersist(),
        players: normalizePlayers(cleaned.map((name) => ({ name }))),
        config: {
          cookieCount: payload.cookieCount,
          mode: payload.mode,
          weeklyLabels: { ...defaultGameConfig().weeklyLabels, ...payload.weeklyLabels },
        },
        screen: 'home',
        unlockedRewards: prevRewards,
      }))
    },
    [],
  )

  const goToPlaying = useCallback(() => {
    setPersist((p) => ({
      ...p,
      screen: 'playing',
      winnerName: null,
      rollHint: null,
      lastSpinLabel: null,
      spinCount: 0,
      flavorBlock: null,
      activePlayerIndex: 0,
      players: p.players.map((pl) => ({
        ...pl,
        position: 1,
        tastedFlavorIds: [],
        missedFlavorIds: [],
        shields: 0,
        extraTurn: false,
        skipNextBite: false,
      })),
    }))
    setChallengeCard(null)
    setFlavorPick(null)
    setSwapOpen(false)
    wheelFollowUpRef.current = 'none'
  }, [])

  const resetRun = useCallback(() => {
    setPersist((p) => {
      const reset = defaultPersist()
      return {
        ...reset,
        config: p.config,
        players: p.players.map((player, index) => ({
          ...reset.players[index % reset.players.length],
          id: player.id,
          name: player.name,
          color: player.color,
        })),
        unlockedRewards: p.unlockedRewards,
      }
    })
    setChallengeCard(null)
    setFlavorPick(null)
    setSwapOpen(false)
    modalPlayerIndexRef.current = null
    wheelFollowUpRef.current = 'none'
  }, [])

  return {
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
  }
}

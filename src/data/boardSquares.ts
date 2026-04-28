import type { BoardSquare, FlavorId, SpaceKind } from '../types/game'

type Row = {
  id: number
  kind: SpaceKind
  flavorId?: FlavorId
  title: string
  modalBody: string
}

const ROWS: Row[] = [
  { id: 1, kind: 'start', title: 'Salida', modalBody: '¡Comienza el camino dulce! Bocado oficial: tamaño de una moneda grande.' },
  { id: 2, kind: 'neutral', title: 'Camino', modalBody: 'Sigues el camino. Nada que probar aquí.' },
  {
    id: 3,
    kind: 'cookie',
    flavorId: 'chocolateChip',
    title: 'Chocolate Chip',
    modalBody: '¡Casilla de galleta! Toma un bocado oficial y márcalo en tu Pasaporte.',
  },
  { id: 4, kind: 'neutral', title: 'Camino', modalBody: 'Sigue el recorrido.' },
  {
    id: 5,
    kind: 'challenge',
    title: 'Reto',
    modalBody: '¡Carta de reto! Cumple el desafío en grupo y sigue jugando.',
  },
  {
    id: 6,
    kind: 'cookie',
    flavorId: 'nutella',
    title: 'Nutella',
    modalBody: '¡Casilla de galleta! Prueba y marca en tu Pasaporte.',
  },
  {
    id: 7,
    kind: 'boost',
    title: 'Boost +2',
    modalBody: '¡Impulso! Avanza 2 casillas extra al cerrar.',
  },
  { id: 8, kind: 'neutral', title: 'Camino', modalBody: 'Sigue adelante.' },
  {
    id: 9,
    kind: 'cookie',
    flavorId: 'weekly1',
    title: 'Weekly #1',
    modalBody: 'Casilla semanal: prueba el sabor o comodín si no está en tu caja.',
  },
  { id: 10, kind: 'neutral', title: 'Camino', modalBody: 'Camino neutro.' },
  {
    id: 11,
    kind: 'cookie',
    flavorId: 'cookiesCream',
    title: 'Cookies & Cream',
    modalBody: '¡Casilla de galleta! Bocado oficial y marca en el Pasaporte.',
  },
  {
    id: 12,
    kind: 'swap',
    title: 'Intercambio',
    modalBody: 'Cambia tu posición con otro jugador. No se prueba galleta por el intercambio.',
  },
  { id: 13, kind: 'neutral', title: 'Camino', modalBody: 'Sigue el camino.' },
  { id: 14, kind: 'challenge', title: 'Reto', modalBody: '¡Carta de reto!' },
  {
    id: 15,
    kind: 'cookie',
    flavorId: 'brownieBatter',
    title: 'Brownie Batter',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  { id: 16, kind: 'neutral', title: 'Camino', modalBody: 'Camino dulce.' },
  {
    id: 17,
    kind: 'cookie',
    flavorId: 'weekly2',
    title: 'Weekly #2',
    modalBody: 'Casilla semanal o comodín según tu caja.',
  },
  {
    id: 18,
    kind: 'extraTurn',
    title: 'Doble turno',
    modalBody: '¡Juegas otra vez inmediatamente después de este turno!',
  },
  { id: 19, kind: 'neutral', title: 'Camino', modalBody: 'Sigue.' },
  {
    id: 20,
    kind: 'cookie',
    flavorId: 'snickerdoodle',
    title: 'Snickerdoodle',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  { id: 21, kind: 'neutral', title: 'Camino', modalBody: 'Camino neutro.' },
  { id: 22, kind: 'challenge', title: 'Reto', modalBody: '¡Carta de reto!' },
  {
    id: 23,
    kind: 'cookie',
    flavorId: 'weekly3',
    title: 'Weekly #3',
    modalBody: 'Casilla semanal o comodín según tu caja.',
  },
  { id: 24, kind: 'neutral', title: 'Camino', modalBody: 'Sigue.' },
  {
    id: 25,
    kind: 'cookie',
    flavorId: 'chocolateChip',
    title: 'Chocolate Chip',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  {
    id: 26,
    kind: 'block',
    title: 'Bloqueo',
    modalBody: 'Elige un sabor activo para bloquearlo una vuelta de mesa.',
  },
  { id: 27, kind: 'neutral', title: 'Camino', modalBody: 'Camino neutro.' },
  {
    id: 28,
    kind: 'cookie',
    flavorId: 'nutella',
    title: 'Nutella',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  { id: 29, kind: 'neutral', title: 'Camino', modalBody: 'Sigue.' },
  { id: 30, kind: 'challenge', title: 'Reto', modalBody: '¡Carta de reto!' },
  {
    id: 31,
    kind: 'cookie',
    flavorId: 'weekly4',
    title: 'Weekly #4',
    modalBody: 'Casilla semanal o comodín según tu caja.',
  },
  {
    id: 32,
    kind: 'shield',
    title: 'Escudo',
    modalBody: '¡Ganas un escudo! Te protege de bloqueo, castigo de reto o perder un bocado (una vez).',
  },
  { id: 33, kind: 'neutral', title: 'Camino', modalBody: 'Camino neutro.' },
  {
    id: 34,
    kind: 'cookie',
    flavorId: 'cookiesCream',
    title: 'Cookies & Cream',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  { id: 35, kind: 'neutral', title: 'Camino', modalBody: 'Sigue.' },
  { id: 36, kind: 'challenge', title: 'Reto', modalBody: '¡Carta de reto!' },
  {
    id: 37,
    kind: 'cookie',
    flavorId: 'brownieBatter',
    title: 'Brownie Batter',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  { id: 38, kind: 'neutral', title: 'Camino', modalBody: 'Camino neutro.' },
  {
    id: 39,
    kind: 'cookie',
    flavorId: 'weekly1',
    title: 'Weekly #1',
    modalBody: 'Casilla semanal o comodín según tu caja.',
  },
  {
    id: 40,
    kind: 'boost',
    title: 'Boost +2',
    modalBody: '¡Impulso! Avanza 2 casillas extra al cerrar.',
  },
  { id: 41, kind: 'neutral', title: 'Camino', modalBody: 'Sigue.' },
  {
    id: 42,
    kind: 'cookie',
    flavorId: 'snickerdoodle',
    title: 'Snickerdoodle',
    modalBody: '¡Casilla de galleta! Prueba y marca.',
  },
  { id: 43, kind: 'challenge', title: 'Reto', modalBody: '¡Carta de reto!' },
  { id: 44, kind: 'neutral', title: 'Camino', modalBody: '¡Casi en la meta!' },
  {
    id: 45,
    kind: 'finish',
    title: 'META',
    modalBody:
      'Llegaste al cofre final. Si ya completaste tu objetivo de sabores, ¡ganas! Si no, deberás volver a un sabor pendiente.',
  },
]

export const boardSquares: BoardSquare[] = ROWS.map((r) => ({
  id: r.id,
  kind: r.kind,
  flavorId: r.flavorId,
  title: r.title,
  modalBody: r.modalBody,
}))

export function getSquareById(id: number): BoardSquare | undefined {
  return boardSquares[id - 1]
}

/*
 * CATÁLOGO DE PREMIOS — Textos en “Mis premios” (tono referencia Weekly / sabores).
 */
export const REWARD_LABELS: Record<string, { title: string; description: string }> = {
  'reward-topping': {
    title: 'Chocolate Chip + topping',
    description: 'Mejora simple pero clara: un premio que sí se siente útil al pedir.',
  },
  'reward-mini-game': {
    title: 'Weekly Mission completada',
    description: 'Recompensa de misión para que el tablero tenga capas, no sólo avance.',
  },
  'reward-coupon': {
    title: 'Cupón sorpresa',
    description: 'Cupón guardado para canje futuro en tienda o por WhatsApp.',
  },
  'reward-secret-flavor': {
    title: 'Pista de sabor secreto',
    description: 'Desbloquea conversación con la marca y empuja al usuario a preguntar.',
  },
  'reward-grand': {
    title: 'Premio oro',
    description: 'Recompensa de mayor peso para acercar el final a un verdadero clímax.',
  },
  'reward-final': {
    title: 'Cofre final',
    description: 'Ganaste CookieLand. Desde aquí el flujo empuja a reclamar y comprar.',
  },
}

/** Leyenda estática tipo barra inferior de la referencia (sabores / Weekly). */
export const FLAVOR_LEGEND: { label: string; ringClass: string }[] = [
  { label: 'Chocolate Chip', ringClass: 'ring-red-400' },
  { label: 'Nutella', ringClass: 'ring-orange-400' },
  { label: 'Cookies & Cream', ringClass: 'ring-slate-500' },
  { label: 'Brownie Batter', ringClass: 'ring-amber-900/60' },
  { label: 'Weekly #1', ringClass: 'ring-violet-500' },
  { label: 'Weekly #2', ringClass: 'ring-fuchsia-500' },
  { label: 'Weekly #3', ringClass: 'ring-sky-500' },
  { label: 'Weekly #4', ringClass: 'ring-emerald-500' },
]

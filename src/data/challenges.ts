export interface ChallengeCard {
  id: string
  title: string
  body: string
}

export const CHALLENGE_DECK: ChallengeCard[] = [
  {
    id: 'c1',
    title: 'Describe el sabor',
    body: 'Describe la galleta en 3 palabras. Si el grupo aprueba, ganas un bocado extra (marca manual si aplica).',
  },
  {
    id: 'c2',
    title: 'Adivina el ingrediente',
    body: 'Di un ingrediente. Si aciertas, puedes marcar el sabor; si fallas, pierdes el bocado (marca con los botones).',
  },
  {
    id: 'c3',
    title: 'Sin decir “rico”',
    body: 'Describe la galleta sin usar la palabra “rico”. Si lo logras, avanza 1 casilla al cerrar (ajusta posición a mano si hace falta).',
  },
  {
    id: 'c4',
    title: 'Cata rápida',
    body: 'Prueba un bocado y di si sabe más a chocolate, vainilla, canela, crema o mantequilla.',
  },
  {
    id: 'c5',
    title: 'Favorito del momento',
    body: 'Di tu sabor favorito hasta ahora. Si alguien coincide, ambos avanzan 1 (acuerden y ajusten si quieren).',
  },
  {
    id: 'c6',
    title: 'Ronda de galleta',
    body: 'Todos prueban un mini bocado del sabor donde cayó el jugador.',
  },
  {
    id: 'c7',
    title: 'Voto secreto',
    body: 'Voten cuál galleta se ve más antojable. El ganador puede usarse como comodín de conversación.',
  },
  {
    id: 'c8',
    title: 'Duelo de sabores',
    body: 'Elige a otro jugador. Cada uno dice qué sabor prefiere. El grupo decide quién explicó mejor; el ganador avanza 2.',
  },
  {
    id: 'c9',
    title: 'Elige a alguien',
    body: 'Elige a un jugador para que pruebe un sabor que todavía no tenga marcado.',
  },
  {
    id: 'c10',
    title: 'Todos contra el hambre',
    body: 'Si todos dicen un sabor distinto que quieren probar, el jugador actual gana escudo (súmalo con el botón si cumplen).',
  },
  {
    id: 'c11',
    title: 'Comodín pendiente',
    body: 'Puedes probar una galleta que te brincaste antes (elige sabor en el pasaporte / selector).',
  },
  {
    id: 'c12',
    title: 'Cambio de antojo',
    body: 'Cambia un sabor marcado por uno que acabas de probar (edita pasaporte a mano: quita uno y marca otro).',
  },
  {
    id: 'c13',
    title: 'Roba turno',
    body: 'Elige a alguien: esa persona pierde el próximo bocado (no el turno).',
  },
  {
    id: 'c14',
    title: 'Escudo dulce',
    body: 'Ganas un escudo. Súmalo con “+ escudo” si lo cumplen.',
  },
  {
    id: 'c15',
    title: 'Revancha',
    body: 'Regresa 2 casillas; si caes en galleta, sí la pruebas (ajusta posición manualmente si hace falta).',
  },
  {
    id: 'c16',
    title: 'Cara de cookie',
    body: 'Haz tu mejor cara de “quiero otra galleta”. Si el grupo se ríe, avanzas 1.',
  },
  {
    id: 'c17',
    title: 'Nombre inventado',
    body: 'Inventa un nombre para la galleta. Si al grupo le gusta, ganas bocado extra.',
  },
  {
    id: 'c18',
    title: 'Publicidad express',
    body: '10 segundos para vender la galleta como comercial. Si lo logras, avanzas 2.',
  },
  {
    id: 'c19',
    title: 'Cookie crítica',
    body: 'Califica del 1 al 10 y explica por qué. Si la razón es buena, marcas el sabor.',
  },
  {
    id: 'c20',
    title: 'La recomendación',
    body: 'Elige a quién le recomendarías la galleta; esa persona puede probar un mini bocado.',
  },
]

export function randomChallenge(): ChallengeCard {
  return CHALLENGE_DECK[Math.floor(Math.random() * CHALLENGE_DECK.length)]!
}

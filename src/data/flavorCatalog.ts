export interface FlavorCard {
  name: string
  subtitle: string
  note: string
  accent: string
}

export const BASE_FLAVORS: FlavorCard[] = [
  {
    name: 'Crumble',
    subtitle: 'Masa dorada y textura suave',
    note: 'La base más clásica para quien quiere una galleta gruesa, limpia y bien mantequillosa.',
    accent: '#ffb86b',
  },
  {
    name: 'Chocolate Chip',
    subtitle: 'Chispas semiamargas',
    note: 'Sabor redondo, tostado y reconocible. El punto de entrada perfecto al menú.',
    accent: '#ff8a5b',
  },
  {
    name: 'Snickerdoodle',
    subtitle: 'Canela y azúcar especiada',
    note: 'Más cálida y aromática. Funciona muy bien para separar la oferta de una cookie shop genérica.',
    accent: '#ffd166',
  },
  {
    name: 'Nutella',
    subtitle: 'Centro avellanado',
    note: 'Perfil indulgente y visualmente fuerte. Ideal para comunicar relleno y antojo.',
    accent: '#8d5a3a',
  },
  {
    name: 'Oreo Cookies & Cream',
    subtitle: 'Crema vainilla y galleta negra',
    note: 'Muy fácil de vender visualmente porque mezcla contraste, topping y nostalgia.',
    accent: '#8ea7ff',
  },
  {
    name: 'Brownie Batter',
    subtitle: 'Cacao intenso y miga densa',
    note: 'La opción más oscura y golosa. Levanta bien el lado premium del catálogo.',
    accent: '#6b4226',
  },
]

export const WEEKLY_FLAVORS: FlavorCard[] = [
  {
    name: 'Weekly #1 · Lotus Biscoff',
    subtitle: 'Crema especiada y crumble caramelizado',
    note: 'Perfecta para abrir semana con una opción más trendy y de alto antojo visual.',
    accent: '#d97745',
  },
  {
    name: 'Weekly #2 · Red Velvet',
    subtitle: 'Cacao rojo con crema ligera',
    note: 'Ayuda a meter color en el menú y se siente edición especial sin explicar demasiado.',
    accent: '#ef476f',
  },
  {
    name: 'Weekly #3 · Peanut Butter Melt',
    subtitle: 'Mantequilla de cacahuate y centro suave',
    note: 'Da variedad real frente a chocolate y vainilla; muy útil para menú corto pero interesante.',
    accent: '#d4a373',
  },
  {
    name: "Weekly #4 · S'mores",
    subtitle: 'Chocolate, malvavisco y toque tostado',
    note: 'Cierra la semana con una opción teatral y fotogénica que funciona muy bien en móvil.',
    accent: '#7c4dff',
  },
]

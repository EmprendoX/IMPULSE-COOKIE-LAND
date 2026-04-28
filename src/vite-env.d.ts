/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Número WhatsApp solo dígitos (sin +), ej: 5491112345678 — configurar en Netlify / .env */
  readonly VITE_WHATSAPP_PHONE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STARTUP_SESSION_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

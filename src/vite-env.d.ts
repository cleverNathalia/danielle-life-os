/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOGGL_WORKER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

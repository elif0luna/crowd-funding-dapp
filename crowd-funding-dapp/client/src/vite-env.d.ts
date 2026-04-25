/// <reference types="vite/client" />
/// <reference path="./thirdweb.d.ts" />

interface EthereumProvider {
  isMetaMask?: boolean
  request(args: { method: string; params?: unknown[] }): Promise<unknown>
  on(eventName: string, handler: (...args: unknown[]) => void): void
  removeListener(eventName: string, handler: (...args: unknown[]) => void): void
}

interface Window {
  ethereum?: EthereumProvider
}

interface ImportMetaEnv {
  readonly VITE_THIRDWEB_CLIENT_ID?: string
  readonly VITE_THIRDWEB_SECRET_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

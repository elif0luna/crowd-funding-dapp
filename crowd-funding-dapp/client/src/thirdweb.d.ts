declare module 'thirdweb' {
  export type ThirdwebClient = unknown
  export type ThirdwebContract = unknown

  export const createThirdwebClient: (options: { clientId: string }) => ThirdwebClient
  export const getContract: (options: { client: ThirdwebClient; chain: unknown; address: string }) => ThirdwebContract
  export const prepareContractCall: (options: unknown) => unknown
  export const readContract: (options: unknown) => Promise<unknown>
  export const sendTransaction: (options: unknown) => Promise<unknown>
  export const toWei: (value: string) => bigint
  export const toEther: (value: bigint) => string
}

declare module 'thirdweb/chains' {
  export const sepolia: { id: number; name: string }
}

declare module 'thirdweb/wallets' {
  export type Account = { address: string }
}

declare module 'thirdweb/react' {
  import type * as React from 'react'

  export const ConnectButton: React.ComponentType<any>
  export const ThirdwebProvider: React.ComponentType<React.PropsWithChildren<{ connectionManager?: unknown }>>
  export const useActiveAccount: () => { address: string } | undefined
  export const useDisconnect: () => { disconnect: () => void }
}

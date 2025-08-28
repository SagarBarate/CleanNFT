/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_MUMBAI_RPC_URL: string
  readonly VITE_IPFS_GATEWAY: string
  readonly VITE_NETWORK_ID: string
  readonly VITE_NETWORK_NAME: string
  readonly VITE_EXPLORER_URL: string
  readonly VITE_CURRENCY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_WEBSITE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}






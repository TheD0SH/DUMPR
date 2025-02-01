export interface NetworkConfig {
    id: string
    name: string
    endpoint: string
    icon: string
    enabled: boolean
  }
  
  export interface TokenBalance {
    token: {
      address: string
      decimals: string | null
      name: string | null
      symbol: string
      type?: string
      exchange_rate?: string
    }
    value: string
  }
  
  export interface WalletData {
    address: string
    tokens: Record<string, TokenBalance[]>
  }
  
  
import type { NetworkConfig } from "@/types/api"

export const networks: NetworkConfig[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    endpoint: "https://eth.blockscout.com",
    icon: "/networks/eth.svg",
    enabled: true,
  },
   /*
  {
    id: "optimism",
    name: "Optimism",
    endpoint: "https://optimism.blockscout.com",
    icon: "/networks/op.svg",
    enabled: true,
  },
    {
    id: "polygon",
    name: "Polygon",
    endpoint: "https://polygon.blockscout.com",
    icon: "/networks/matic.svg",
    enabled: true,
  },
    {
    id: "zksync",
    name: "zkSync Era",
    endpoint: "https://zksync.blockscout.com",
    icon: "/networks/zksync.svg",
    enabled: true,
  },
  {
    id: "gnosis",
    name: "Gnosis",
    endpoint: "https://gnosis.blockscout.com",
    icon: "/networks/gno.svg",
    enabled: true,
  },
    */
  {
    id: "base",
    name: "Base",
    endpoint: "https://base.blockscout.com",
    icon: "/networks/base.svg",
    enabled: true,
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    endpoint: "https://arbitrum.blockscout.com",
    icon: "/networks/arb.svg",
    enabled: true,
  },
  // Removed potentially unavailable networks to prevent 404 errors

  {
    id: "flow",
    name: "Flow",
    endpoint: "https://evm.flowscan.io/",
    icon: "/networks/gno.svg",
    enabled: true,
  },
  {
    id: "flowtestnet",
    name: "Flow Testnet",
    endpoint: "https://evm-testnet.flowscan.io/",
    icon: "/networks/gno.svg",
    enabled: true,
  },
]


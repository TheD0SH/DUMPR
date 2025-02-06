# DUMPR - Multi-Chain Token Dumping Aggregator

Convert your dust tokens across multiple chains into ETH or SOL with AI-powered market analysis.

## 🌟 Features

- **Multi-Chain Support**: Scan and manage tokens across multiple EVM-compatible networks
- **AI-Powered Analysis**: Optimize token conversion strategies using market analysis
- **Batch Processing**: Minimize gas fees by batching transactions
- **User-Friendly Interface**: Simple three-step process to dump tokens
- **Secure Transactions**: Non-custodial design with direct wallet execution

## 📁 Project Structure

```text
DUMPR/
├── app/
│   ├── app/
│   │   └── page.tsx           # Main application page with token dumping functionality
│   ├── layout.tsx            # Root layout with background setup
│   └── page.tsx              # Landing page with feature showcase
├── components/
│   ├── connect-wallet.tsx    # Wallet connection component
│   ├── network-selector.tsx  # Network selection interface
│   ├── token-list.tsx       # Token listing and selection component
│   ├── wallet-list.tsx      # Connected wallets management
│   └── web3-provider.tsx    # Web3 context provider
├── config/
│   └── networks.ts          # Network configuration and endpoints
├── lib/
│   ├── api.ts              # Token balance fetching and calculations
│   ├── networks.ts         # Network definitions and settings
│   └── utils.ts            # Utility functions
└── types/
    └── api.ts              # TypeScript interfaces for API responses



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


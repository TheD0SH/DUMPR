"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface Token {
  address: string
  symbol: string
  balance: string
  value: string
}

interface TokenListProps {
  wallets: string[]
  onTokenSelect: (tokenAddress: string) => void
  selectedTokens: string[]
}

export const TokenList = ({ wallets, onTokenSelect, selectedTokens }: TokenListProps) => {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const mockTokens: Token[] = [
      { address: "0x123...", symbol: "MOCK1", balance: "100", value: "$0.50" },
      { address: "0x456...", symbol: "MOCK2", balance: "200", value: "$1.20" },
      { address: "0x789...", symbol: "MOCK3", balance: "300", value: "$0.75" },
    ]
    setTokens(mockTokens)
  }, [])

  return (
    <div>
      {tokens.length > 0 ? (
        <ul className="space-y-2">
          {tokens.map((token) => (
            <li key={token.address} className="flex items-center justify-between bg-background/50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={token.address}
                  checked={selectedTokens.includes(token.address)}
                  onCheckedChange={() => onTokenSelect(token.address)}
                />
                <div>
                  <label htmlFor={token.address} className="text-sm font-medium cursor-pointer">
                    {token.symbol}
                  </label>
                  <p className="text-xs text-muted-foreground">Balance: {token.balance}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">≈ {token.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No tokens found</p>
      )}
    </div>
  )
}


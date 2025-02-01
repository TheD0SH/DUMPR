"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown, ChevronRight } from "lucide-react"
import type { TokenBalance } from "@/types/api"
import { formatTokenValue, calculateUSDValue, calculateTotalUSDValue } from "@/lib/api"

interface TokenListProps {
  tokens: Record<string, TokenBalance[]>
  isLoading: boolean
  onTokenSelect: (networkId: string, tokenAddress: string) => void
  selectedTokens: Record<string, string[]>
}

export const TokenList = ({ tokens = {}, isLoading = false, onTokenSelect, selectedTokens = {} }: TokenListProps) => {
  const [expandedNetworks, setExpandedNetworks] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  const networkIds = Object.keys(tokens)

  if (networkIds.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-sm text-muted-foreground">
          No tokens found. Please connect a wallet and select networks first.
        </p>
      </div>
    )
  }

  const toggleNetwork = (networkId: string) => {
    setExpandedNetworks((prev) => ({
      ...prev,
      [networkId]: !prev[networkId],
    }))
  }

  const handleSelectAll = (networkId: string, select: boolean) => {
    const networkTokens = tokens[networkId] || []
    const updatedTokens = select ? networkTokens.map((t) => t.token.address) : []
    onTokenSelect(networkId, updatedTokens.join(","))
  }

  return (
    <div className="space-y-4">
      {networkIds.map((networkId) => {
        const networkTokens = tokens[networkId] || []
        const totalUSDValue = calculateTotalUSDValue(networkTokens)
        const isExpanded = expandedNetworks[networkId]

        return (
          <div key={`network-${networkId}`} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-white/5 cursor-pointer"
              onClick={() => toggleNetwork(networkId)}
            >
              <div className="flex items-center space-x-2">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <h3 className="text-sm font-medium capitalize">{networkId}</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                {networkTokens.length} tokens | {totalUSDValue}
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <Button size="sm" variant="outline" onClick={() => handleSelectAll(networkId, true)}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSelectAll(networkId, false)}>
                    Deselect All
                  </Button>
                </div>

                {networkTokens.length > 0 ? (
                  <ul className="space-y-2">
                    {networkTokens.map((token, index) => {
                      const formattedValue = formatTokenValue(token.value, token.token.decimals)
                      const usdValue = calculateUSDValue(token.value, token.token.decimals, token.token.exchange_rate)
                      return (
                        <li
                          key={`${networkId}-${token.token.address}-${index}`}
                          className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`${networkId}-${token.token.address}-${index}`}
                              checked={selectedTokens[networkId]?.includes(token.token.address)}
                              onCheckedChange={() => onTokenSelect(networkId, token.token.address)}
                            />
                            <div>
                              <label
                                htmlFor={`${networkId}-${token.token.address}-${index}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {token.token.symbol}
                              </label>
                              <p className="text-xs text-muted-foreground">Balance: {formattedValue}</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{usdValue}</span>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No tokens detected for this network</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}


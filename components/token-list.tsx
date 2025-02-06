"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronDown, ChevronRight } from "lucide-react"
import type { TokenBalance, GasTokenBalance, SelectedToken } from "@/types/api"
import { formatTokenValue, calculateUSDValue, calculateTotalUSDValue } from "@/lib/api"

interface TokenListProps {
  tokens: Record<string, TokenBalance[] | null>
  gasBalances: Record<string, GasTokenBalance>
  isLoading: boolean
  onTokenSelect: (
    networkId: string,
    tokenAddress: string,
    isSelected: boolean,
    tokenSymbol: string,
    tokenUsdValue: string,
  ) => void
  selectedTokens: Record<string, SelectedToken[]>
}

export const TokenList = ({
  tokens = {},
  gasBalances = {},
  isLoading = false,
  onTokenSelect,
  selectedTokens = {},
}: TokenListProps) => {
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

  const handleSelectAll = (networkId: string) => {
    const networkTokens = tokens[networkId] || []
    if (!networkTokens) return // Exit if no tokens found for this network
    const gasToken = gasBalances[networkId]
    const allTokenAddresses = [...(gasToken ? [networkId] : []), ...networkTokens.map((t) => t.token.address)]
    const allSelected = allTokenAddresses.every((address) =>
      selectedTokens[networkId]?.some((token) => token.address === address),
    )

    if (gasToken) {
      onTokenSelect(networkId, networkId, !allSelected, gasToken.symbol, gasToken.usdBalance)
    }

    networkTokens.forEach((token) => {
      const usdValue = calculateUSDValue(token.value, token.token.decimals, token.token.exchange_rate)
      onTokenSelect(networkId, token.token.address, !allSelected, token.token.symbol, usdValue.replace("$", ""))
    })
  }

  const calculateTotalNetworkValue = (networkId: string) => {
    const networkTokens = tokens[networkId] || []
    const tokenValue = Number.parseFloat(calculateTotalUSDValue(networkTokens).replace("$", ""))
    const gasValue = Number.parseFloat(gasBalances[networkId]?.usdBalance || "0")
    return (tokenValue + gasValue).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  }

  return (
    <div className="space-y-4">
      {networkIds.map((networkId) => {
        const networkTokens = tokens[networkId] || null
        const gasBalance = gasBalances[networkId]
        const totalValue = calculateTotalNetworkValue(networkId)
        const isExpanded = expandedNetworks[networkId]
        const allTokenAddresses = [
          ...(gasBalance ? [networkId] : []),
          ...(networkTokens?.map((t) => t.token.address) || []),
        ]
        const allSelected = allTokenAddresses.every((address) =>
          selectedTokens[networkId]?.some((token) => token.address === address),
        )

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
                {networkTokens ? `${networkTokens.length + (gasBalance ? 1 : 0)} tokens` : "No tokens"} | {totalValue}
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectAll(networkId)
                    }}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </Button>
                </div>

                <ul className="space-y-2">
                  {gasBalance && (
                    <li className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`${networkId}-gas`}
                          checked={selectedTokens[networkId]?.some((token) => token.address === networkId)}
                          onCheckedChange={(checked) =>
                            onTokenSelect(
                              networkId,
                              networkId,
                              checked as boolean,
                              gasBalance.symbol,
                              gasBalance.usdBalance,
                            )
                          }
                        />
                        <div>
                          <label htmlFor={`${networkId}-gas`} className="text-sm font-medium cursor-pointer">
                            {gasBalance.symbol} (Gas Token)
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Balance: {formatTokenValue(gasBalance.balance, "18")}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">${gasBalance.usdBalance}</span>
                    </li>
                  )}
                  {networkTokens ? (
                    networkTokens.length > 0 ? (
                      networkTokens.map((token, index) => {
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
                                checked={selectedTokens[networkId]?.some((t) => t.address === token.token.address)}
                                onCheckedChange={(checked) =>
                                  onTokenSelect(
                                    networkId,
                                    token.token.address,
                                    checked as boolean,
                                    token.token.symbol,
                                    usdValue.replace("$", ""),
                                  )
                                }
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
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No additional tokens detected for this network</p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">No tokens found for this network</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}


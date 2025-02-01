"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { TokenBalance } from "@/types/api"
import { formatTokenValue, calculateUSDValue } from "@/lib/api"

interface TokenListProps {
  tokens: Record<string, TokenBalance[]>
  isLoading: boolean
  onTokenSelect: (networkId: string, tokenAddress: string) => void
  selectedTokens: Record<string, string[]>
}

export const TokenList = ({ tokens = {}, isLoading = false, onTokenSelect, selectedTokens = {} }: TokenListProps) => {
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

  return (
    <div className="space-y-6">
      {networkIds.map((networkId) => {
        const networkTokens = tokens[networkId] || []
        return (
          <div key={`network-${networkId}`} className="space-y-2">
            <h3 className="text-sm font-medium capitalize">{networkId}</h3>
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
              <p className="text-sm text-muted-foreground">No tokens found for this network</p>
            )}
          </div>
        )
      })}
    </div>
  )
}


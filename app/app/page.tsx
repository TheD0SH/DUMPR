"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletList } from "@/components/wallet-list"
import { TokenList } from "@/components/token-list"
import { ConnectWallet } from "@/components/connect-wallet"
import { NetworkSelector } from "@/components/network-selector"
import { Coins, Wallet, ArrowRightLeft } from "lucide-react"
import { networks } from "@/lib/networks"
import { fetchAllTokenBalances } from "@/lib/api"
import type { NetworkConfig, TokenBalance, GasTokenBalance, SelectedToken } from "@/types/api"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WalletData {
  address: string
  label: string
  tokens: Record<string, TokenBalance[]>
  gasBalances: Record<string, GasTokenBalance>
}

export default function TokenDumper() {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [selectedNetworks, setSelectedNetworks] = useState<NetworkConfig[]>(networks)
  const [selectedTokens, setSelectedTokens] = useState<Record<string, SelectedToken[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("connect")
  const [receiveAddress, setReceiveAddress] = useState("")
  const [receiveToken, setReceiveToken] = useState("eth")

  const handleWalletConnect = async (address: string, label: string) => {
    if (!address || wallets.some((w) => w.address.toLowerCase() === address.toLowerCase())) {
      return
    }

    setIsLoading(true)
    try {
      const { tokens, gasBalances } = await fetchAllTokenBalances(
        selectedNetworks.filter((n) => n.enabled),
        address,
      )

      setWallets((prev) => {
        const newWallets = [...prev, { address, label, tokens, gasBalances }]
        if (newWallets.length === 1) {
          setReceiveAddress(address)
        }
        return newWallets
      })
      setCurrentTab("select")
    } catch (error) {
      console.error("Error fetching tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletRemove = (addressToRemove: string) => {
    setWallets((prev) => prev.filter((w) => w.address !== addressToRemove))
  }

  const handleNetworkChange = async (networks: NetworkConfig[]) => {
    setSelectedNetworks(networks)
    // Refresh tokens for all connected wallets
    setIsLoading(true)
    try {
      const updatedWallets = await Promise.all(
        wallets.map(async (wallet) => {
          const { tokens, gasBalances } = await fetchAllTokenBalances(
            networks.filter((n) => n.enabled),
            wallet.address,
          )
          return { ...wallet, tokens, gasBalances }
        }),
      )
      setWallets(updatedWallets)
    } catch (error) {
      console.error("Error updating tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSelect = (
    networkId: string,
    tokenAddress: string,
    isSelected: boolean,
    tokenSymbol: string,
    tokenUsdValue: string,
  ) => {
    setSelectedTokens((prev) => {
      const networkTokens = prev[networkId] || []
      const updatedTokens = isSelected
        ? [...networkTokens, { address: tokenAddress, symbol: tokenSymbol, usdValue: tokenUsdValue }]
        : networkTokens.filter((token) => token.address !== tokenAddress)

      return {
        ...prev,
        [networkId]: updatedTokens,
      }
    })
  }

  const calculateTotalValue = () => {
    return Object.values(selectedTokens).reduce((total, networkTokens) => {
      return (
        total +
        networkTokens.reduce((networkTotal, token) => {
          return networkTotal + Number.parseFloat(token.usdValue.replace("$", ""))
        }, 0)
      )
    }, 0)
  }

  // Combine tokens and gas balances from all wallets
  const allTokens = wallets.reduce(
    (acc, wallet) => {
      Object.entries(wallet.tokens).forEach(([networkId, tokens]) => {
        if (!acc[networkId]) {
          acc[networkId] = tokens
        } else {
          acc[networkId] = [...acc[networkId], ...tokens]
        }
      })
      return acc
    },
    {} as Record<string, TokenBalance[]>,
  )

  const allGasBalances = wallets.reduce(
    (acc, wallet) => {
      Object.entries(wallet.gasBalances).forEach(([networkId, gasBalance]) => {
        if (!acc[networkId]) {
          acc[networkId] = gasBalance
        } else {
          // Sum up gas balances if multiple wallets have balances on the same network
          const existingBalance = Number.parseFloat(acc[networkId].balance)
          const newBalance = Number.parseFloat(gasBalance.balance)
          const totalBalance = existingBalance + newBalance
          acc[networkId] = {
            balance: totalBalance.toString(),
            usdBalance: (
              Number.parseFloat(acc[networkId].usdBalance) + Number.parseFloat(gasBalance.usdBalance)
            ).toFixed(2),
            symbol: gasBalance.symbol,
          }
        }
      })
      return acc
    },
    {} as Record<string, GasTokenBalance>,
  )

  const handleDump = () => {
    console.log("Dumping tokens:", selectedTokens)
    console.log("Receive address:", receiveAddress)
    console.log("Receive token:", receiveToken)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-black/80">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Token Dumper
          </h1>
          <p className="text-white/80">Convert your dust tokens into ETH or SOL in one click</p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-black/50 backdrop-blur-sm">
            <TabsTrigger value="connect" className="flex items-center gap-2 py-3 data-[state=active]:bg-white/10">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Connect</span>
            </TabsTrigger>
            <TabsTrigger
              value="select"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white/10"
              disabled={wallets.length === 0}
            >
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">Select</span>
            </TabsTrigger>
            <TabsTrigger
              value="dump"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-white/10"
              disabled={Object.keys(selectedTokens).length === 0}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dump</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect">
            <Card className="border-none bg-black/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Connect Your Wallets</CardTitle>
                <CardDescription>Add EVM and Solana wallets to start dumping your tokens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConnectWallet onConnect={handleWalletConnect} walletCount={wallets.length} />
                <NetworkSelector onNetworkChange={handleNetworkChange} />
                <WalletList
                  wallets={wallets.map((w) => ({ address: w.address, label: w.label }))}
                  onRemove={handleWalletRemove}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="select">
            <Card className="border-none bg-black/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Select Tokens to Dump</CardTitle>
                <CardDescription>Choose the tokens you want to swap for ETH or SOL.</CardDescription>
              </CardHeader>
              <CardContent>
                <TokenList
                  tokens={allTokens}
                  gasBalances={allGasBalances}
                  isLoading={isLoading}
                  onTokenSelect={handleTokenSelect}
                  selectedTokens={selectedTokens}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dump">
            <Card className="border-none bg-black/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Dump Your Tokens</CardTitle>
                <CardDescription>Review and confirm the tokens you want to dump.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-white/5 p-4">
                  <h3 className="text-sm font-medium mb-2">Selected Tokens:</h3>
                  {Object.keys(selectedTokens).length > 0 ? (
                    <ul className="space-y-1">
                      {Object.entries(selectedTokens).map(([networkId, tokens]) =>
                        tokens.map((token, index) => (
                          <li
                            key={`${networkId}-${token.address}-${index}`}
                            className="text-sm text-white/60 cursor-pointer hover:text-white/80"
                            onClick={() => alert(`Token Address: ${token.address}`)}
                          >
                            {networkId}: {token.symbol} (${token.usdValue})
                          </li>
                        )),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/60">No tokens selected</p>
                  )}
                </div>

                <div className="rounded-lg bg-white/5 p-4">
                  <h3 className="text-sm font-medium mb-2">From Wallets:</h3>
                  <ul className="space-y-1">
                    {wallets.map((wallet, index) => (
                      <li key={index} className="text-sm text-white/60">
                        {wallet.label}: {wallet.address}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Receive</label>
                  <div className="flex items-center space-x-2">
                    <Select value={receiveToken} onValueChange={setReceiveToken}>
                      <SelectTrigger className="w-full bg-white/5 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eth">ETH</SelectItem>
                        <SelectItem value="sol">SOL</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm font-medium">Estimated Total: ${calculateTotalValue().toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="receiveAddress" className="text-sm font-medium">
                    Receive Address
                  </label>
                  <Input
                    id="receiveAddress"
                    placeholder="Enter receive address"
                    value={receiveAddress}
                    onChange={(e) => setReceiveAddress(e.target.value)}
                    className="bg-white/5 border-0"
                  />
                </div>

                <Button
                  onClick={handleDump}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={Object.keys(selectedTokens).length === 0 || !receiveAddress}
                >
                  Dump Tokens
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


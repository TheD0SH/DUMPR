"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletList } from "@/components/wallet-list"
import { TokenList } from "@/components/token-list"
import { ConnectWallet } from "@/components/connect-wallet"
import { NetworkSelector } from "@/components/network-selector"
import { Coins, Wallet, ArrowRightLeft } from "lucide-react"
import { networks } from "@/lib/networks"
import { fetchAllTokenBalances } from "@/lib/api"
import type { NetworkConfig, TokenBalance, WalletData } from "@/types/api"

export default function TokenDumper() {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [selectedNetworks, setSelectedNetworks] = useState<NetworkConfig[]>(networks)
  const [selectedTokens, setSelectedTokens] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("connect")

  const handleWalletConnect = async (address: string) => {
    if (!address || wallets.some((w) => w.address.toLowerCase() === address.toLowerCase())) {
      return
    }

    setIsLoading(true)
    try {
      const tokenBalances = await fetchAllTokenBalances(
        selectedNetworks.filter((n) => n.enabled),
        address,
      )

      setWallets((prev) => [...prev, { address, tokens: tokenBalances }])
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
        wallets.map(async (wallet) => ({
          address: wallet.address,
          tokens: await fetchAllTokenBalances(
            networks.filter((n) => n.enabled),
            wallet.address,
          ),
        })),
      )
      setWallets(updatedWallets)
    } catch (error) {
      console.error("Error updating tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSelect = (networkId: string, tokenAddresses: string) => {
    setSelectedTokens((prev) => {
      const addresses = tokenAddresses.split(",")
      if (addresses.length === 1) {
        // Toggle single token
        const networkTokens = prev[networkId] || []
        const updatedTokens = networkTokens.includes(addresses[0])
          ? networkTokens.filter((addr) => addr !== addresses[0])
          : [...networkTokens, addresses[0]]

        return {
          ...prev,
          [networkId]: updatedTokens,
        }
      } else {
        // Set multiple tokens (select all / deselect all)
        return {
          ...prev,
          [networkId]: addresses.filter((addr) => addr !== ""),
        }
      }
    })
  }

  // Combine tokens from all wallets
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

  const handleDump = () => {
    console.log("Dumping tokens:", selectedTokens)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-black/80">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            DUMPR.
          </h1>
          <p className="text-white/80">Convert your dust or shidcoins into ETH or SOL in one click</p>
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
                <CardDescription>Add EVM and Solana wallets to start dumping your unwanted tokens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConnectWallet onConnect={handleWalletConnect} />
                <NetworkSelector onNetworkChange={handleNetworkChange} />
                <WalletList wallets={wallets.map((w) => w.address)} onRemove={handleWalletRemove} />
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
                          <li key={`${networkId}-${token}-${index}`} className="text-sm text-white/60">
                            {networkId}: {token}
                          </li>
                        )),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/60">No tokens selected</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Receive</label>
                  <select className="w-full bg-white/5 border-0 rounded-lg p-2 text-sm text-white">
                    <option value="eth">ETH</option>
                    <option value="sol">SOL</option>
                  </select>
                </div>

                <Button
                  onClick={handleDump}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={Object.keys(selectedTokens).length === 0}
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


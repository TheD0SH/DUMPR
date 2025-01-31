"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletList } from "@/components/wallet-list"
import { TokenList } from "@/components/token-list"
import { ConnectWallet } from "@/components/connect-wallet"
import { Coins, Wallet, ArrowRightLeft } from "lucide-react"

export default function TokenDumper() {
  const [connectedWallets, setConnectedWallets] = useState<string[]>([])
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

  const handleWalletConnect = (address: string) => {
    setConnectedWallets((prev) => [...prev, address])
  }

  const handleTokenSelect = (tokenAddress: string) => {
    setSelectedTokens((prev) =>
      prev.includes(tokenAddress) ? prev.filter((addr) => addr !== tokenAddress) : [...prev, tokenAddress],
    )
  }

  const handleDump = () => {
    console.log("Dumping tokens:", selectedTokens)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Token Dumper
          </h1>
          <p className="text-muted-foreground">Convert your dust tokens into ETH or SOL in one click</p>
        </div>

        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-secondary/50 backdrop-blur-sm">
            <TabsTrigger value="connect" className="flex items-center gap-2 py-3">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Connect</span>
            </TabsTrigger>
            <TabsTrigger value="select" className="flex items-center gap-2 py-3">
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">Select</span>
            </TabsTrigger>
            <TabsTrigger value="dump" className="flex items-center gap-2 py-3">
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dump</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect">
            <Card className="border-none bg-secondary/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Connect Your Wallets</CardTitle>
                <CardDescription>Add EVM and Solana wallets to start dumping your tokens.</CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectWallet onConnect={handleWalletConnect} />
                <WalletList wallets={connectedWallets} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="select">
            <Card className="border-none bg-secondary/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Select Tokens to Dump</CardTitle>
                <CardDescription>Choose the tokens you want to swap for ETH or SOL.</CardDescription>
              </CardHeader>
              <CardContent>
                <TokenList
                  wallets={connectedWallets}
                  onTokenSelect={handleTokenSelect}
                  selectedTokens={selectedTokens}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dump">
            <Card className="border-none bg-secondary/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Dump Your Tokens</CardTitle>
                <CardDescription>Review and confirm the tokens you want to dump.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <h3 className="text-sm font-medium mb-2">Selected Tokens:</h3>
                  {selectedTokens.length > 0 ? (
                    <ul className="space-y-1">
                      {selectedTokens.map((token) => (
                        <li key={token} className="text-sm text-muted-foreground">
                          {token}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tokens selected</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Receive</label>
                  <select className="w-full bg-secondary/50 border-0 rounded-lg p-2 text-sm">
                    <option value="eth">ETH</option>
                    <option value="sol">SOL</option>
                  </select>
                </div>

                <Button
                  onClick={handleDump}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={selectedTokens.length === 0}
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


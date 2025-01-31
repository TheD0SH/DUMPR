"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"

interface ConnectWalletProps {
  onConnect: (address: string) => void
}

export const ConnectWallet = ({ onConnect }: ConnectWalletProps) => {
  const [address, setAddress] = useState("")

  const handleConnect = () => {
    if (address) {
      onConnect(address)
      setAddress("")
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-background/50"
      />
      <Button
        onClick={handleConnect}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        disabled={!address}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Wallet
      </Button>
    </div>
  )
}


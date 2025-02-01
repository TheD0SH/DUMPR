"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { networks } from "@/lib/networks"
import type { NetworkConfig } from "@/types/api"

interface NetworkSelectorProps {
  onNetworkChange: (networks: NetworkConfig[]) => void
}

export const NetworkSelector = ({ onNetworkChange }: NetworkSelectorProps) => {
  const [selectedNetworks, setSelectedNetworks] = useState<NetworkConfig[]>(
    networks.map((network) => ({ ...network, enabled: true })),
  )

  const handleNetworkToggle = (network: NetworkConfig) => {
    const updatedNetworks = selectedNetworks.map((n) => {
      if (n.id === network.id) {
        return { ...n, enabled: !n.enabled }
      }
      return n
    })
    setSelectedNetworks(updatedNetworks)
    onNetworkChange(updatedNetworks.filter((n) => n.enabled))
  }

  return (
    <div className="grid gap-4">
      <h3 className="text-sm font-medium">Select Networks</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {networks.map((network) => (
          <div
            key={network.id}
            className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-white/5"
          >
            <Checkbox
              id={network.id}
              checked={selectedNetworks.find((n) => n.id === network.id)?.enabled}
              onCheckedChange={() => handleNetworkToggle(network)}
            />
            <label htmlFor={network.id} className="flex items-center space-x-2 cursor-pointer flex-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {network.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{network.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}


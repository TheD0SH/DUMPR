import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WalletListProps {
  wallets: { address: string; label: string }[]
  onRemove: (address: string) => void
}

export const WalletList = ({ wallets, onRemove }: WalletListProps) => {
  if (!wallets.length) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Connected Wallets:</h3>
        <p className="text-sm text-muted-foreground">No wallets connected</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Connected Wallets:</h3>
      <ul className="space-y-2">
        {wallets.map((wallet) => (
          <li key={wallet.address} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium">{wallet.label}</span>
              <span className="text-xs font-mono text-muted-foreground truncate">{wallet.address}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onRemove(wallet.address)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}


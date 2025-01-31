import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WalletListProps {
  wallets: string[]
}

export const WalletList = ({ wallets }: WalletListProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Connected Wallets:</h3>
      {wallets.length > 0 ? (
        <ul className="space-y-2">
          {wallets.map((wallet) => (
            <li key={wallet} className="flex items-center justify-between bg-background/50 p-3 rounded-lg">
              <span className="text-sm font-mono">{wallet}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No wallets connected</p>
      )}
    </div>
  )
}


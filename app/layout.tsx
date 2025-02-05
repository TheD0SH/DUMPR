import "./globals.css"
import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "DUMPR - Convert Your Dust to Treasure",
  description: "Effortlessly convert your small token balances across multiple chains into ETH or SOL",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="background-image" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}


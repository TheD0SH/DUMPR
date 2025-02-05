import "./globals.css"
import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Token Dumper",
  description: "Convert your dust tokens into ETH or SOL",
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


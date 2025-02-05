"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const videoElement = document.getElementById("bg-video") as HTMLVideoElement
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.log("Video autoplay failed:", error)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        {/* Hero Section with Video Background */}
        <div className="relative h-screen">
          <video
            id="bg-video"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source
              src="https://res.cloudinary.com/dwkyf71du/video/upload/f_auto:video,q_auto/cxaunqkrqmsgczf2z9km"
              type="video/mp4"
            />
          </video>

          {/* Content overlay */}
          <div className="relative z-10">
            <header className="container mx-auto px-4 py-8 flex justify-between items-center">
              <div className="text-2xl font-bold tracking-tight">DUMPR</div>
              <nav>
                <ul className="flex space-x-8">
                  <li>
                    <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </nav>
            </header>

            <div className="container mx-auto px-4 py-32 text-center">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                Convert Your Dust to <span className="text-[#3B82F6]">Treasure</span>
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                The DUMPR Agent converts your small token balances across multiple chains into ETH, by maximizing your
                portfolio's value using AI market analysis.
              </p>
              <Link href="/app">
                <Button className="h-12 px-6 text-base bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full inline-flex items-center gap-2">
                  Let's Dump
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Rest of the sections */}
        <section id="features" className="py-24 bg-[#1B2232]">
          {/* Features section content */}
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-lg bg-[#252B3B] text-center">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#3B82F6]">
                    <path
                      fill="currentColor"
                      d="M13 17.0001H17L13 21.0001H9L13 17.0001ZM11 3.00006H15L11 7.00006H7L11 3.00006ZM11 9.00006H15L11 13.0001H7L11 9.00006Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Multi-Chain Support</h3>
                <p className="text-gray-400">
                  Seamlessly connect and manage tokens across various blockchain networks.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-[#252B3B] text-center">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#3B82F6]">
                    <path
                      fill="currentColor"
                      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.1597 10C10.1243 10 8.27898 10.8187 6.97638 12.1213L4.84825 10C6.65652 8.17039 9.2262 7 12.1597 7C15.0932 7 17.6629 8.17039 19.4712 10L17.343 12.1213C16.0404 10.8187 14.1951 10 12.1597 10Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Dust Conversion</h3>
                <p className="text-gray-400">
                  Automatically swap small token balances for ETH, increasing your holdings.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-[#252B3B] text-center">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#3B82F6]">
                    <path
                      fill="currentColor"
                      d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM11.003 16L18.073 8.929L16.659 7.515L11.003 13.172L8.174 10.343L6.76 11.757L11.003 16Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure Transactions</h3>
                <p className="text-gray-400">
                  Advanced security measures ensure your assets are protected throughout the process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works section */}
        <section id="how-it-works" className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-400">
                      Enter your wallet address to start scanning for dust tokens across multiple chains.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Select Networks & Tokens</h3>
                    <p className="text-gray-400">
                      Choose which networks to scan and select the tokens you want to convert.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                    <p className="text-gray-400">
                      Our AI analyzes market conditions to determine the best conversion strategy for your tokens.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Review & Confirm</h3>
                    <p className="text-gray-400">
                      Check the conversion details and confirm the transaction to receive your consolidated ETH.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section id="faq" className="py-24 bg-[#1B2232]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto grid gap-8">
              <div className="p-8 rounded-lg bg-[#252B3B]">
                <h3 className="text-xl font-semibold mb-4">What is a dust balance?</h3>
                <p className="text-gray-400">
                  Dust balances are small amounts of cryptocurrency in your wallet that are often too small to trade or
                  transfer due to transaction fees. These small amounts can add up across different tokens and networks.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-[#252B3B]">
                <h3 className="text-xl font-semibold mb-4">How does DUMPR work?</h3>
                <p className="text-gray-400">
                  DUMPR aggregates your dust tokens across multiple networks and uses AI-powered market analysis to find
                  the most efficient way to convert them into ETH. We batch transactions where possible to minimize fees
                  and maximize your returns.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-[#252B3B]">
                <h3 className="text-xl font-semibold mb-4">Which networks are supported?</h3>
                <p className="text-gray-400">
                  DUMPR supports major networks including Base & Flow. If hackathon project get's traction we will
                  deploy to more networks.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-[#252B3B]">
                <h3 className="text-xl font-semibold mb-4">Is DUMPR safe to use?</h3>
                <p className="text-gray-400">
                  Yes, DUMPR prioritizes security. We never store your private keys, and all transactions are executed
                  directly through your wallet. Our AI agents rely on TEEs and all private info is stored on Nilion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-black py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2025 DUMPR Agent. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}


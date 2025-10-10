'use client'

import { useState, useEffect } from 'react'
// Removed unused useWallet import
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function SimpleWalletButton() {
  // Removed unused wallet variables
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-gray-800 px-4 py-2 rounded-lg">
        <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="wallet-adapter-button-trigger">
      <WalletMultiButton />
    </div>
  )
}

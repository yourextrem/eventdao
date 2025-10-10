'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function SimpleWalletButton() {
  const { connected, publicKey, wallet, disconnect } = useWallet()
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

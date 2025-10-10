'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function WalletButton() {
  const { connected, connecting, disconnecting, publicKey, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Removed unused handleConnect function

  const handleDisconnect = async () => {
    try {
      setError(null)
      await disconnect()
    } catch (err) {
      console.error('Disconnection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet')
    }
  }

  if (!mounted) {
    return (
      <div className="bg-gray-800 px-4 py-2 rounded-lg">
        <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-2">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
        <WalletMultiButton />
      </div>
    )
  }

  if (connected && publicKey) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-2">
          <p className="text-green-400 text-xs">
            Connected: {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          {disconnecting ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <WalletMultiButton />
      {connecting && (
        <p className="text-blue-400 text-xs">Connecting...</p>
      )}
    </div>
  )
}

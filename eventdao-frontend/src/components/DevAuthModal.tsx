'use client'

import { useState } from 'react'

interface DevAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DevAuthModal({ isOpen, onClose }: DevAuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Simulate authentication for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful authentication
      setMessage('Development mode: Authentication simulated successfully!')
      
      // Simulate user session by storing in localStorage
      const mockUser = {
        id: 'dev-user-123',
        email: email,
        username: email.split('@')[0],
        created_at: new Date().toISOString()
      }
      
      localStorage.setItem('dev-user', JSON.stringify(mockUser))
      
      setTimeout(() => {
        onClose()
        setEmail('')
        setPassword('')
        setMessage('')
        // Trigger auth state update without reload
        window.dispatchEvent(new CustomEvent('authStateChanged'))
      }, 1500)
    } catch (err) {
      console.error('Auth error:', err)
      setMessage('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-gray-900 rounded-lg border border-gray-600 w-full max-w-md p-6 mx-4 shadow-2xl"
        style={{ zIndex: 1000000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Development Notice */}
        <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-3 mb-4">
          <p className="text-blue-400 text-sm">
            <strong>Development Mode:</strong> This is a demo authentication. 
            No real authentication is performed.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {message && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-3">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            This is a development demo. In production, this would connect to Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}

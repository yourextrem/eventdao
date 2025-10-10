'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'

interface UserProfileProps {
  onClose: () => void
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, signOut } = useSupabase()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Form states
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  // Avatar options
  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user7',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user8',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user10',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user11',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user12',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user13',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user14',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user15'
  ]

  useEffect(() => {
    if (user) {
      const usernameValue = user.user_metadata?.username || user.email?.split('@')[0] || 'user'
      setUsername(usernameValue)
      setFullName(user.user_metadata?.full_name || '')
      setBio(user.user_metadata?.bio || '')
      setAvatarUrl(user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameValue}`)
      setWalletAddress(user.user_metadata?.wallet_address || '')
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // In development mode, just update localStorage
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user?.user_metadata,
            username,
            full_name: fullName,
            bio,
            avatar_url: avatarUrl,
            wallet_address: walletAddress
          }
        }
        
        localStorage.setItem('dev-user', JSON.stringify(updatedUser))
        window.dispatchEvent(new CustomEvent('authStateChanged'))
        setMessage('Profile updated successfully!')
        setIsEditing(false)
      } else {
        // TODO: Implement real Supabase profile update
        setMessage('Profile update functionality coming soon!')
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Profile update error:', err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
                     {avatarUrl ? (
                       <Image
                         src={avatarUrl}
                         alt="Profile Avatar"
                         width={120}
                         height={120}
                         className="rounded-full border-4 border-gray-200"
                         style={{ width: '120px', height: '120px' }}
                         unoptimized={true}
                       />
                     ) : (
                <div className="w-30 h-30 rounded-full border-4 border-gray-200 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl font-bold">
                    {username?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => setAvatarUrl(avatarOptions[Math.floor(Math.random() * avatarOptions.length)])}
                  className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
                  title="Generate new avatar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">Click refresh to generate new avatar</p>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter username"
                />
              ) : (
                <input
                  type="text"
                  value={username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  disabled
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter full name"
                />
              ) : (
                <input
                  type="text"
                  value={fullName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  disabled
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter wallet address"
                />
              ) : (
                <input
                  type="text"
                  value={walletAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  disabled
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tell us about yourself"
                rows={3}
              />
            ) : (
              <textarea
                value={bio}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                disabled
                rows={3}
              />
            )}
          </div>

          {/* Status Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email Verified:</span>
                <span className={`font-medium ${user.email_confirmed_at ? 'text-green-600' : 'text-red-600'}`}>
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setError('')
                      setMessage('')
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
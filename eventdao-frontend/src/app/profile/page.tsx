'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfilePage() {
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

  // Avatar options with fallback
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

  const [avatarError, setAvatarError] = useState(false)
  const [showAvatarOptions, setShowAvatarOptions] = useState(false)
  const [uploading, setUploading] = useState(false)

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

    console.log('Saving profile with data:', {
      username,
      fullName,
      bio,
      avatarUrl,
      walletAddress,
      user: user?.id
    })

    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')

      console.log('Supabase configured:', isSupabaseConfigured)

      if (isSupabaseConfigured) {
        // Use real Supabase profile update
        const { supabase } = await import('@/lib/supabase')
        
        // Update auth.users metadata
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: {
            username: username,
            full_name: fullName,
            bio: bio,
            avatar_url: avatarUrl,
            wallet_address: walletAddress,
          }
        })

        if (authUpdateError) {
          throw authUpdateError
        }

        // Update public.profiles table
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            username: username,
            full_name: fullName,
            bio: bio,
            avatar_url: avatarUrl,
            wallet_address: walletAddress,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id)

        if (profileUpdateError) {
          console.warn('Profile table update failed:', profileUpdateError)
          // Continue anyway since auth update succeeded
        }

        setMessage('Profile updated successfully!')
        setIsEditing(false)
        
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1500)
        
      } else {
        // Development mode: update localStorage
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
        
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (err: unknown) {
      console.error('Profile update error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to update profile: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setAvatarUrl(result)
          setAvatarError(false)
          setMessage('Avatar uploaded successfully!')
          setTimeout(() => setMessage(''), 3000)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      // Use router instead of window.location for better Next.js integration
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-transparent border-b border-gray-600 backdrop-blur-sm bg-black bg-opacity-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-white text-xl font-bold">EventDAO</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-green-400 font-medium">
                Home
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {/* Profile Info */}
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                {avatarUrl && !avatarError ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile Avatar"
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-gray-200"
                    style={{ width: '150px', height: '150px' }}
                    unoptimized={true}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-38 h-38 rounded-full border-4 border-gray-200 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-4xl font-bold">
                      {username?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <div className="absolute bottom-0 right-0 flex space-x-2">
                    <button
                      onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                      className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
                      title="Avatar options"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setAvatarError(false)
                        setAvatarUrl(avatarOptions[Math.floor(Math.random() * avatarOptions.length)])
                      }}
                      className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
                      title="Generate new avatar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {isEditing ? 'Click icons to upload or generate avatar' : 'Click refresh to generate new avatar'}
              </p>
            </div>

            {/* Avatar Options Modal */}
            {showAvatarOptions && isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Avatar Options</h3>
                    <button
                      onClick={() => setShowAvatarOptions(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Your Own Avatar
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          id="avatar-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">
                            {uploading ? 'Uploading...' : 'Click to upload image'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </label>
                      </div>
                    </div>

                    {/* Generated Avatars */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Generated Avatar
                      </label>
                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                        {avatarOptions.map((avatar, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setAvatarUrl(avatar)
                              setAvatarError(false)
                              setShowAvatarOptions(false)
                            }}
                            className="w-full h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
                          >
                            <Image
                              src={avatar}
                              alt={`Avatar ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Info Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              ) : (
                <textarea
                  value={bio}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  disabled
                  rows={4}
                />
              )}
            </div>

            {/* Status Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {user.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sign In:</span>
                  <span className="text-gray-900">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setShowAvatarOptions(false)
                      // Reset fields to original values if cancel
                      if (user) {
                        const usernameValue = user.user_metadata?.username || user.email?.split('@')[0] || 'user'
                        setUsername(usernameValue)
                        setFullName(user.user_metadata?.full_name || '')
                        setBio(user.user_metadata?.bio || '')
                        setAvatarUrl(user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameValue}`)
                        setWalletAddress(user.user_metadata?.wallet_address || '')
                      }
                      setError('')
                      setMessage('')
                      setAvatarError(false)
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

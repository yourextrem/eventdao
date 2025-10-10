'use client'

import { useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import SimpleAuthModal from './SimpleAuthModal'
import DevAuthModal from './DevAuthModal'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthButton() {
  const { user, loading } = useSupabase()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Check if Supabase is configured
  const isPlaceholderKey = (key: string) => {
    return key.includes('dummy') || key.includes('placeholder') || key.includes('your-')
  }
  
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !isPlaceholderKey(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !isPlaceholderKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (loading) {
    return (
      <div className="bg-gray-800 px-4 py-2 rounded-lg">
        <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User'
    const userInitial = user.user_metadata?.username?.[0] || user.email?.[0] || 'U'

    return (
      <Link
        href="/profile"
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        {avatarUrl && !avatarUrl.includes('api.dicebear.com') ? (
          // Show uploaded photo if available and not DiceBear
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={avatarUrl}
              alt="Profile Avatar"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized={true}
            />
          </div>
        ) : avatarUrl && avatarUrl.includes('api.dicebear.com') ? (
          // Show DiceBear avatar
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={avatarUrl}
              alt="Profile Avatar"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized={true}
            />
          </div>
        ) : (
          // Fallback to initial
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {userInitial}
            </span>
          </div>
        )}
        <span className="text-sm font-medium">
          {username}
        </span>
      </Link>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      >
        Sign In
      </button>
      
      {isSupabaseConfigured ? (
        <SimpleAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      ) : (
        <DevAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
}

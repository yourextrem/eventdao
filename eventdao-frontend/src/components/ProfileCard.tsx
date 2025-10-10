'use client'

import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfileCard() {
  const { user } = useSupabase()

  if (!user) return null

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url
  const userInitial = username[0]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          {avatarUrl && !avatarUrl.includes('api.dicebear.com') ? (
            // Show uploaded photo if available and not DiceBear
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 overflow-hidden">
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          ) : avatarUrl && avatarUrl.includes('api.dicebear.com') ? (
            // Show DiceBear avatar
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 overflow-hidden">
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized={true}
              />
            </div>
          ) : (
            // Fallback to initial
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-xl font-bold">
                {userInitial}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{username}</h3>
        <p className="text-sm text-gray-600 mb-4">{user.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-gray-500">Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-xs text-gray-500">Claims</div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/profile"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  )
}

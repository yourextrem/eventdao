'use client'

import { useState } from 'react'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...')
      
      // Test basic connection
      const { error } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1)
      
      if (error && error.code === 'PGRST116') {
        // This error means the table doesn't exist, but connection is working
        setConnectionStatus('✅ Supabase connected successfully!')
        setIsConnected(true)
      } else if (error) {
        setConnectionStatus(`❌ Connection error: ${error.message}`)
        setIsConnected(false)
      } else {
        setConnectionStatus('✅ Supabase connected successfully!')
        setIsConnected(true)
      }
    } catch (err) {
      setConnectionStatus(`❌ Connection failed: ${err}`)
      setIsConnected(false)
    }
  }

  return (
    <div className="bg-black bg-opacity-40 p-6 rounded-lg border border-gray-600 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-4">Supabase Connection Test</h3>
      
      <div className="mb-4">
        <p className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {connectionStatus}
        </p>
      </div>
      
      <button
        onClick={testConnection}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Test Connection
      </button>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>Make sure you have:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Created .env.local file with your Supabase credentials</li>
          <li>Set NEXT_PUBLIC_SUPABASE_URL</li>
          <li>Set NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>Set SUPABASE_SERVICE_ROLE_KEY (server-side only)</li>
        </ul>
        <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
          <p><strong>Admin Client:</strong> {supabaseAdmin ? 'Available' : 'Not available (client-side)'}</p>
        </div>
      </div>
    </div>
  )
}

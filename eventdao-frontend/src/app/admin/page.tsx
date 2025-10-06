'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function AdminPage() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('config');

  const tabs = [
    { id: 'config', name: 'Configuration', icon: '⚙️' },
    { id: 'events', name: 'Event Management', icon: '📅' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ];

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-900 shadow-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
                  EventDAO
                </Link>
                <span className="ml-2 text-sm text-gray-400">Admin Panel</span>
              </div>
              <div className="flex items-center gap-4">
                <WalletMultiButton />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to access admin functions</p>
            <WalletMultiButton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
                EventDAO
              </Link>
              <span className="ml-2 text-sm text-gray-400">Admin Panel</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white font-medium">Home</Link>
              <Link href="/submit" className="text-gray-300 hover:text-white font-medium">Submit</Link>
              <Link href="/explore" className="text-gray-300 hover:text-white font-medium">Explore</Link>
              <Link href="/leaderboard" className="text-gray-300 hover:text-white font-medium">Leaderboard</Link>
              <Link href="/wallet" className="text-gray-300 hover:text-white font-medium">Wallet</Link>
              <Link href="/admin" className="text-green-400 font-medium">Admin</Link>
              <Link href="/about" className="text-gray-300 hover:text-white font-medium">About</Link>
            </nav>
            <div className="flex items-center gap-4">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-gray-600">Manage EventDAO configuration and monitor system activity</p>
        </div>

        {/* Dev Mode Notice */}
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">🔒</div>
            <div>
              <h3 className="text-sm font-medium text-red-200">Development Mode</h3>
              <p className="text-sm text-red-700 mt-1">
                Admin functions are simulated for development. Real admin controls will be implemented with proper authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">System Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resolution Window (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue="48"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Bond (EVE)
                  </label>
                  <input
                    type="number"
                    defaultValue="0.1"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Protocol Fee (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="2"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Stake per User (EVE)
                  </label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Update Configuration
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Network Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RPC Endpoint
                  </label>
                  <input
                    type="text"
                    defaultValue="https://api.devnet.solana.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Program ID
                  </label>
                  <input
                    type="text"
                    defaultValue="8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Event Management</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Stakes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">Coldplay Concert Jakarta</div>
                          <div className="text-sm text-gray-400">2025-03-15</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        <div>Authentic: 2.5 EVE</div>
                        <div>Hoax: 0.8 EVE</div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-green-400 hover:text-blue-800 text-sm">Resolve</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">156</div>
                  <div className="text-blue-800">Total Users</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <div className="text-green-800">Active Today</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">45</div>
                  <div className="text-purple-800">Event Authors</div>
                </div>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-400">User management features coming soon</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">System Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">2,847</div>
                  <div className="text-blue-800">Total Stakes</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89.2%</div>
                  <div className="text-green-800">Avg Accuracy</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-purple-800">Active Verifiers</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">45</div>
                  <div className="text-orange-800">Events Resolved</div>
                </div>
              </div>
              
              <div className="mt-8 text-center py-8">
                <p className="text-gray-400">Detailed analytics dashboard coming soon</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

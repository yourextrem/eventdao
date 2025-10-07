'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function AdminPage() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('config');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'config', name: 'Configuration', icon: '⚙️' },
    { id: 'events', name: 'Event Management', icon: '📅' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed-background"></div>
      
      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Header */}
        <header className="bg-transparent border-b border-gray-600 backdrop-blur-sm bg-black bg-opacity-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Image
                  src="/images/eventdao_letter.png"
                  alt="EventDAO"
                  width={120}
                  height={30}
                  className="mr-8"
                  style={{ width: 'auto', height: 'auto' }}
                />
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
                {mounted && <WalletMultiButton />}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
            <p className="text-gray-300">Manage EventDAO configuration and monitor system activity</p>
          </div>

          {!connected && (
            <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-8 text-center mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Connect Wallet Required</h2>
              <p className="text-gray-300 mb-6">Connect your wallet to access admin functions</p>
              {mounted && <WalletMultiButton />}
            </div>
          )}

          {connected && (
            <>
              {/* Dev Mode Notice */}
              <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 mb-8 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="text-red-400 mr-3">🔒</div>
                  <div>
                    <h3 className="text-sm font-medium text-red-200">Development Mode</h3>
                    <p className="text-sm text-red-300 mt-1">
                      Admin functions are simulated for development. Real admin controls will be implemented with proper authorization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-600 mb-8">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-green-400 text-green-400'
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
                  <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white mb-4">System Configuration</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Resolution Window (hours)
                        </label>
                        <input
                          type="number"
                          defaultValue="48"
                          className="w-full px-3 py-2 bg-black bg-opacity-20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                          className="w-full px-3 py-2 bg-black bg-opacity-20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                          className="w-full px-3 py-2 bg-black bg-opacity-20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Stake per User (EVE)
                        </label>
                        <input
                          type="number"
                          defaultValue="100"
                          className="w-full px-3 py-2 bg-black bg-opacity-20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                        Update Configuration
                      </button>
                    </div>
                  </div>

                  <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Network Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          RPC Endpoint
                        </label>
                        <input
                          type="text"
                          defaultValue="https://api.devnet.solana.com"
                          className="w-full px-3 py-2 bg-black bg-opacity-20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Program ID
                        </label>
                        <input
                          type="text"
                          defaultValue="8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK"
                          className="w-full px-3 py-2 bg-black bg-opacity-20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Event Management</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-600">
                        <thead className="bg-black bg-opacity-20">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Stakes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-black bg-opacity-10 divide-y divide-gray-600">
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
                              <button className="text-green-400 hover:text-green-300 text-sm">Resolve</button>
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
                  <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg border border-blue-500">
                        <div className="text-2xl font-bold text-blue-400">156</div>
                        <div className="text-blue-300">Total Users</div>
                      </div>
                      <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg border border-green-500">
                        <div className="text-2xl font-bold text-green-400">89</div>
                        <div className="text-green-300">Active Today</div>
                      </div>
                      <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg border border-purple-500">
                        <div className="text-2xl font-bold text-purple-400">45</div>
                        <div className="text-purple-300">Event Authors</div>
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
                  <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6">
                    <h2 className="text-xl font-bold text-white mb-4">System Analytics</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg border border-blue-500">
                        <div className="text-2xl font-bold text-blue-400">2,847</div>
                        <div className="text-blue-300">Total Stakes</div>
                      </div>
                      <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg border border-green-500">
                        <div className="text-2xl font-bold text-green-400">89.2%</div>
                        <div className="text-green-300">Avg Accuracy</div>
                      </div>
                      <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg border border-purple-500">
                        <div className="text-2xl font-bold text-purple-400">156</div>
                        <div className="text-purple-300">Active Verifiers</div>
                      </div>
                      <div className="bg-orange-500 bg-opacity-20 p-4 rounded-lg border border-orange-500">
                        <div className="text-2xl font-bold text-orange-400">45</div>
                        <div className="text-orange-300">Events Resolved</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center py-8">
                      <p className="text-gray-400">Detailed analytics dashboard coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

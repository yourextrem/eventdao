'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function LeaderboardPage() {
  const { connected } = useWallet();
  const [timeframe, setTimeframe] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for demonstration
  const leaderboard = [
    {
      rank: 1,
      address: '0x1234...5678',
      accuracy: 95.2,
      totalStaked: 12.5,
      wins: 24,
      losses: 2,
      reputation: 1250
    },
    {
      rank: 2,
      address: '0x2345...6789',
      accuracy: 92.8,
      totalStaked: 8.7,
      wins: 18,
      losses: 3,
      reputation: 980
    },
    {
      rank: 3,
      address: '0x3456...7890',
      accuracy: 89.5,
      totalStaked: 15.2,
      wins: 22,
      losses: 4,
      reputation: 920
    },
    {
      rank: 4,
      address: '0x4567...8901',
      accuracy: 87.3,
      totalStaked: 6.8,
      wins: 16,
      losses: 3,
      reputation: 850
    },
    {
      rank: 5,
      address: '0x5678...9012',
      accuracy: 85.1,
      totalStaked: 9.3,
      wins: 19,
      losses: 5,
      reputation: 780
    }
  ];

  const topAuthors = [
    {
      rank: 1,
      address: '0x9876...5432',
      eventsSubmitted: 8,
      eventsVerified: 7,
      totalBond: 4.2,
      reputation: 1100
    },
    {
      rank: 2,
      address: '0x8765...4321',
      eventsSubmitted: 6,
      eventsVerified: 5,
      totalBond: 3.1,
      reputation: 950
    },
    {
      rank: 3,
      address: '0x7654...3210',
      eventsSubmitted: 5,
      eventsVerified: 4,
      totalBond: 2.8,
      reputation: 820
    }
  ];

  if (!connected) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/eventdao_background.png"
            alt="EventDAO Background"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            style={{
              objectPosition: 'center top'
            }}
          />
        </div>
        
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
                <div className="flex items-center gap-4">
                  {mounted && <WalletMultiButton />}
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Leaderboard</h1>
              <p className="text-gray-300 mb-8">Connect your wallet to view rankings</p>
              {mounted && <WalletMultiButton />}
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-white hover:text-green-400 font-medium">Home</Link>
                  <Link href="/submit" className="text-white hover:text-green-400 font-medium">Submit Event</Link>
                  <Link href="/explore" className="text-white hover:text-green-400 font-medium">Explore Events</Link>
                  <Link href="/leaderboard" className="text-green-400 font-medium">Leaderboard</Link>
                  <Link href="/wallet" className="text-white hover:text-green-400 font-medium">Wallet</Link>
                  <Link href="/admin" className="text-white hover:text-green-400 font-medium">Admin</Link>
                  <Link href="/about" className="text-white hover:text-green-400 font-medium">About</Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                {mounted && <WalletMultiButton />}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Leaderboard</h1>
            <p className="text-gray-300">Top verifiers and event authors in the EventDAO community</p>
        </div>

        {/* Timeframe Filter */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              timeframe === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              timeframe === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              timeframe === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Verifiers */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Top Verifiers</h2>
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.address}</div>
                      <div className="text-sm text-gray-400">
                        {user.wins}W / {user.losses}L • {user.accuracy}% accuracy
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{user.totalStaked} SOL</div>
                    <div className="text-sm text-gray-400">{user.reputation} rep</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Authors */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Top Authors</h2>
            <div className="space-y-4">
              {topAuthors.map((author) => (
                <div key={author.rank} className="flex items-center justify-between p-4 bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      author.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      author.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      author.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {author.rank}
                    </div>
                    <div>
                      <div className="font-medium text-white">{author.address}</div>
                      <div className="text-sm text-gray-400">
                        {author.eventsSubmitted} submitted • {author.eventsVerified} verified
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{author.totalBond} SOL</div>
                    <div className="text-sm text-gray-400">{author.reputation} rep</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black bg-opacity-10 p-6 rounded-lg text-center border border-gray-600 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400 mb-2">156</div>
            <div className="text-gray-300">Total Verifiers</div>
          </div>
          <div className="bg-black bg-opacity-10 p-6 rounded-lg text-center border border-gray-600 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-600 mb-2">89.2%</div>
            <div className="text-gray-300">Avg Accuracy</div>
          </div>
          <div className="bg-black bg-opacity-10 p-6 rounded-lg text-center border border-gray-600 backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400 mb-2">2,847</div>
            <div className="text-gray-300">Total Stakes</div>
          </div>
          <div className="bg-black bg-opacity-10 p-6 rounded-lg text-center border border-gray-600 backdrop-blur-sm">
            <div className="text-2xl font-bold text-orange-400 mb-2">45</div>
            <div className="text-gray-300">Active Authors</div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}

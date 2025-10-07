'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ExplorePage() {
  const { connected } = useWallet();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for demonstration
  const events = [
    {
      id: 1,
      title: "Coldplay Concert Jakarta 2025",
      description: "Coldplay will perform at Jakarta International Stadium on March 15, 2025",
      category: "concert",
      date: "2025-03-15",
      location: "Jakarta, Indonesia",
      status: "active",
      authenticStake: 2.5,
      hoaxStake: 0.8,
      bond: 1.0,
      timeLeft: "2d 14h"
    },
    {
      id: 2,
      title: "Web3 Conference Bali 2025",
      description: "Annual Web3 conference featuring top blockchain speakers",
      category: "conference",
      date: "2025-04-20",
      location: "Bali, Indonesia",
      status: "active",
      authenticStake: 1.2,
      hoaxStake: 0.3,
      bond: 0.5,
      timeLeft: "5d 8h"
    }
  ];

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.category === filter;
  });

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
              <h1 className="text-3xl font-bold text-white mb-4">Explore Events</h1>
              <p className="text-gray-300 mb-8">Connect your wallet to explore and stake on events</p>
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
                  <Link href="/explore" className="text-green-400 font-medium">Explore Events</Link>
                  <Link href="/leaderboard" className="text-white hover:text-green-400 font-medium">Leaderboard</Link>
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
          <h1 className="text-3xl font-bold text-white mb-4">Explore Events</h1>
          <p className="text-gray-600">Browse and stake on events for verification</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('concert')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'concert' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
              }`}
            >
              Concerts
            </button>
            <button
              onClick={() => setFilter('conference')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'conference' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
              }`}
            >
              Conferences
            </button>
            <button
              onClick={() => setFilter('sports')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === 'sports' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
              }`}
            >
              Sports
            </button>
          </div>

          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="stake">Highest Stake</option>
              <option value="ending">Ending Soon</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-400 text-lg mb-4">No events found</p>
              <Link
                href="/submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Submit First Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>📅 {event.date}</span>
                      <span>📍 {event.location}</span>
                      <span className="capitalize">🏷️ {event.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{event.authenticStake} SOL</div>
                    <div className="text-sm text-gray-400">Authentic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{event.hoaxStake} SOL</div>
                    <div className="text-sm text-gray-400">Hoax</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-400">
                    Bond: <span className="font-medium">{event.bond} SOL</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Time left: <span className="font-medium text-orange-600">{event.timeLeft}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium">
                    Stake Authentic
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium">
                    Stake Hoax
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

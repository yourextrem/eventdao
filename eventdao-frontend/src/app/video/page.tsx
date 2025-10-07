'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function VideoPage() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                <Link href="/admin" className="text-gray-300 hover:text-white font-medium">Admin</Link>
                <Link href="/about" className="text-gray-300 hover:text-white font-medium">About</Link>
                <Link href="/video" className="text-green-400 font-medium">Video</Link>
              </nav>
              <div className="flex items-center gap-4">
                {mounted && <WalletMultiButton />}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">EventDAO Video</h1>
            <p className="text-gray-300 text-lg">Watch our introduction and demo video</p>
          </div>

          {/* Video Player */}
          <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6 mb-8">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-contain"
                controls
                preload="metadata"
                poster="/images/eventdao_background.png"
              >
                <source src="/videos/Vau1t X MidEvils.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-bold text-white mb-4">About This Video</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Video Details</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Format: MP4</li>
                  <li>• Duration: Full demo</li>
                  <li>• Quality: HD</li>
                  <li>• File Size: 317MB</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Features Shown</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Event submission process</li>
                  <li>• Wallet integration</li>
                  <li>• Staking mechanism</li>
                  <li>• Verification system</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Video Not Playing?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Common Issues</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Large file size (317MB) - may take time to load</li>
                  <li>• Browser compatibility issues</li>
                  <li>• Network connection speed</li>
                  <li>• Video codec not supported</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Solutions</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Wait for video to fully load</li>
                  <li>• Try a different browser</li>
                  <li>• Check your internet connection</li>
                  <li>• Update your browser</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

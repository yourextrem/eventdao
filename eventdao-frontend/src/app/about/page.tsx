'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function AboutPage() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                EventDAO
              </Link>
              <span className="ml-2 text-sm text-gray-500">Proof of Event on Solana</span>
            </div>
            <div className="flex items-center gap-4">
              {!connected && <WalletMultiButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Hook */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            EventDAO – Proof of Event on Solana
          </h1>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
            <p className="text-xl text-gray-700 italic leading-relaxed">
              &ldquo;Imagine a world where every concert, seminar, or sports match you attend 
              can be verified on-chain. No fake tickets. No unverifiable claims. 
              Just transparent, collectible proof of attendance.&rdquo;
            </p>
          </div>
        </section>

        {/* Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Current Problems</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                Events today are hard to verify
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                Fake tickets, manual attendance, unverifiable claims
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">•</span>
                People want digital proof they can trust and collect
              </li>
            </ul>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">EventDAO Solution</h2>
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded mb-6">
            <p className="text-lg text-gray-700 mb-4">
              <strong>EventDAO</strong> = A Solana-based platform for event verification
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Users submit event claims (e.g. &apos;Coldplay Jakarta, Nov 15, 2025, happened&apos;)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Others stake small amounts (0.01–0.1 SOL) for or against
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Resolution via APIs, news feeds, or oracles
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Winners earn rewards
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">•</span>
                Attendees mint unique NFT Proof of Attendance
              </li>
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Event Verification Market</h3>
              <p className="text-blue-700">Transparent and decentralized event verification marketplace</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-3">NFT Attendance (POAPs)</h3>
              <p className="text-green-700">Mint NFTs as collectible proof of attendance</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Gamification</h3>
              <p className="text-purple-700">Leaderboards, badges, and engaging reward systems</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-900 mb-3">Community DAO</h3>
              <p className="text-orange-700">Community DAO for event curation and moderation</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Easy Verification</h4>
                  <p className="text-gray-600">Via official APIs and trusted oracles</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Fun & Lightweight</h4>
                  <p className="text-gray-600">Not political or hoax-sensitive</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Global Use Case</h4>
                  <p className="text-gray-600">Concerts, sports, conferences worldwide</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Consumer-Friendly</h4>
                  <p className="text-gray-600">NFTs as easy-to-use digital tickets</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Solana */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Solana?</h2>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Metaplex for NFTs</h4>
                <p className="text-gray-600">Well-integrated NFT standards</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pyth Oracles</h4>
                <p className="text-gray-600">Accurate real-time data verification</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Solana Pay</h4>
                <p className="text-gray-600">Efficient payment system</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Low Fees</h4>
                <p className="text-gray-600">Perfect for mass adoption</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Roadmap</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-400 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">MVP (Hackathon)</h4>
              <p className="text-gray-600">Submit claims, stake, resolve, reward, NFT attendance</p>
            </div>
            <div className="border-l-4 border-green-400 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Expansion</h4>
              <p className="text-gray-600">Partner with event organizers, add leaderboards</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Global Scaling</h4>
              <p className="text-gray-600">Standard for NFT ticketing & proof of event</p>
            </div>
          </div>
        </section>

        {/* Hackathon Pitch */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hackathon Pitch</h2>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
            <blockquote className="text-xl italic leading-relaxed">
              &ldquo;EventDAO is the truth market for real-world events. 
              Claims are verified automatically, attendees earn NFT proof of attendance, 
              and everything is transparent on Solana. From Coldplay in Jakarta to global conferences, 
              EventDAO makes your presence verifiable and collectible.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join EventDAO?
            </h3>
            <p className="text-gray-600 mb-6">
              Start verifying events and mint your NFT proof of attendance today!
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </Link>
              {!connected && <WalletMultiButton />}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

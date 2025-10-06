'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function SubmitPage() {
  const { connected } = useWallet();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventUrl: '',
    category: 'concert',
    date: '',
    location: '',
    bond: 0.1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle event submission logic here
    console.log('Submitting event:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bond' ? parseFloat(value) || 0 : value
    }));
  };

  if (!connected) {
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
                <span className="ml-2 text-sm text-gray-500">Solana Web3 Events</span>
              </div>
              <div className="flex items-center gap-4">
                <WalletMultiButton />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit an Event</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to submit events for verification</p>
            <WalletMultiButton />
          </div>
        </main>
      </div>
    );
  }

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
              <span className="ml-2 text-sm text-gray-500">Solana Web3 Events</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link href="/submit" className="text-blue-600 font-medium">Submit</Link>
              <Link href="/explore" className="text-gray-700 hover:text-gray-900 font-medium">Explore</Link>
              <Link href="/leaderboard" className="text-gray-700 hover:text-gray-900 font-medium">Leaderboard</Link>
              <Link href="/wallet" className="text-gray-700 hover:text-gray-900 font-medium">Wallet</Link>
              <Link href="/admin" className="text-gray-700 hover:text-gray-900 font-medium">Admin</Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
            </nav>
            <div className="flex items-center gap-4">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit an Event</h1>
          <p className="text-gray-600">
            Submit an event for community verification. Stake a bond to ensure quality submissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Coldplay Concert Jakarta 2025"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the event details..."
            />
          </div>

          <div>
            <label htmlFor="eventUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Event URL *
            </label>
            <input
              type="url"
              id="eventUrl"
              name="eventUrl"
              value={formData.eventUrl}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/event-details"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="concert">Concert</option>
                <option value="conference">Conference</option>
                <option value="sports">Sports</option>
                <option value="festival">Festival</option>
                <option value="seminar">Seminar</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Jakarta Convention Center, Indonesia"
            />
          </div>

          <div>
            <label htmlFor="bond" className="block text-sm font-medium text-gray-700 mb-2">
              Bond Amount (SOL) *
            </label>
            <input
              type="number"
              id="bond"
              name="bond"
              value={formData.bond}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Bond will be slashed if the event is proven to be fake or misleading
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Submission Guidelines</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Provide accurate and verifiable event information</li>
              <li>• Include official event URL or ticketing link</li>
              <li>• Bond will be returned if event is verified as authentic</li>
              <li>• Bond will be slashed if event is proven fake</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Event
            </button>
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

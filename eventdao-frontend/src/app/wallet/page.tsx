'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Transaction {
  signature: string;
  type: 'Faucet' | 'Stake' | 'Reward' | 'Transfer';
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  timestamp: number;
}

export default function WalletPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [eveBalance, setEveBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [faucetLoading, setFaucetLoading] = useState(false);

  // Mock data for development
  const mockStats = {
    totalStaked: 25.5,
    totalEarned: 12.3,
    totalLost: 2.1,
    reputation: 850
  };

  // Mock transaction history
  const mockTransactions: Transaction[] = [
    {
      signature: '5K7...8H2',
      type: 'Faucet',
      amount: 100,
      status: 'Success',
      timestamp: Date.now() - 3600000
    },
    {
      signature: '3M9...2L5',
      type: 'Stake',
      amount: -5.0,
      status: 'Success',
      timestamp: Date.now() - 7200000
    },
    {
      signature: '7N4...9K1',
      type: 'Reward',
      amount: 2.5,
      status: 'Success',
      timestamp: Date.now() - 10800000
    }
  ];

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      setTransactions(mockTransactions);
    }
  }, [connected, publicKey, connection]);

  const fetchBalance = async () => {
    if (!publicKey) return;
    
    try {
      setIsLoading(true);
      const solBalance = await connection.getBalance(publicKey);
      setBalance(solBalance / LAMPORTS_PER_SOL);
      
      // Mock EVE balance for development
      setEveBalance(150.5);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaucetClaim = async () => {
    if (!publicKey) return;
    
    try {
      setFaucetLoading(true);
      
      // Simulate faucet claim - in real implementation, this would call the faucet program
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update mock balance
      setEveBalance(prev => prev + 100);
      
      // Add transaction to history
      const newTransaction: Transaction = {
        signature: Math.random().toString(36).substring(2, 8) + '...' + Math.random().toString(36).substring(2, 8),
        type: 'Faucet',
        amount: 100,
        status: 'Success',
        timestamp: Date.now()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      alert('Successfully claimed 100 EVE tokens!');
    } catch (error) {
      console.error('Error claiming faucet:', error);
      alert('Failed to claim tokens. Please try again.');
    } finally {
      setFaucetLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

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
                <span className="ml-2 text-sm text-gray-400">Dev Dashboard</span>
              </div>
              <div className="flex items-center gap-4">
                <WalletMultiButton />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">EventDAO Dev Dashboard</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to access the development dashboard</p>
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
              <span className="ml-2 text-sm text-gray-400">Dev Dashboard</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white font-medium">Home</Link>
              <Link href="/submit" className="text-gray-300 hover:text-white font-medium">Submit</Link>
              <Link href="/explore" className="text-gray-300 hover:text-white font-medium">Explore</Link>
              <Link href="/leaderboard" className="text-gray-300 hover:text-white font-medium">Leaderboard</Link>
              <Link href="/wallet" className="text-green-400 font-medium">Wallet</Link>
              <Link href="/admin" className="text-gray-300 hover:text-white font-medium">Admin</Link>
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
          <h1 className="text-3xl font-bold text-white mb-4">Dev Dashboard</h1>
          <p className="text-gray-600">Manage your EVE tokens, view balances, and track transaction history</p>
        </div>

        {/* Dev Mode Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Development Mode</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Running on Solana Devnet. All transactions are free and tokens are for testing purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Faucet Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Token Faucet</h2>
          <p className="text-blue-700 mb-4">
            Claim 100 EVE tokens for testing. This faucet is available on devnet only.
          </p>
          <button
            onClick={handleFaucetClaim}
            disabled={faucetLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {faucetLoading ? 'Claiming...' : 'Claim 100 EVE'}
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Available Balance</h3>
            <div className="text-2xl font-bold text-white">{eveBalance.toFixed(2)} EVE</div>
            <div className="text-sm text-gray-400 mt-1">EVE Tokens</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">SOL Balance</h3>
            <div className="text-2xl font-bold text-white">{balance.toFixed(4)} SOL</div>
            <div className="text-sm text-gray-400 mt-1">Network Fee</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Staked</h3>
            <div className="text-2xl font-bold text-white">{mockStats.totalStaked} EVE</div>
            <div className="text-sm text-gray-400 mt-1">In Active Events</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Net Earnings</h3>
            <div className="text-2xl font-bold text-green-600">+{mockStats.totalEarned} EVE</div>
            <div className="text-sm text-gray-400 mt-1">Total Rewards</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Staking Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Staked:</span>
                <span className="font-medium">{mockStats.totalStaked} EVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Earned:</span>
                <span className="font-medium text-green-600">+{mockStats.totalEarned} EVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Lost:</span>
                <span className="font-medium text-red-600">-{mockStats.totalLost} EVE</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Reputation</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{mockStats.reputation}</div>
              <div className="text-gray-600">Reputation Points</div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <div className="text-sm text-gray-400 mt-1">85% to next level</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Stake on Event
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                Submit Event
              </button>
              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Signature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-200">
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.type === 'Faucet' ? 'bg-blue-100 text-blue-800' :
                          tx.type === 'Stake' ? 'bg-purple-100 text-purple-800' :
                          tx.type === 'Reward' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} EVE
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.status === 'Success' ? 'bg-green-100 text-green-800' :
                          tx.status === 'Failed' ? 'bg-red-100 text-red-200' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                        {tx.signature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatTimestamp(tx.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { EventCard } from '@/components/EventCard';
import { CreateEventModal } from '@/components/CreateEventModal';
import { useEventDAO } from '@/hooks/useEventDAO';

interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  ticketPrice: number;
  isActive: boolean;
  createdAt: number;
}

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userTickets, setUserTickets] = useState<Map<number, { hasTicket: boolean; isUsed: boolean }>>(new Map());
  const [isEventDAOInitialized, setIsEventDAOInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const {
    loading,
    error,
    initializeEventDAO,
    createEvent,
    buyTicket,
    submitTicket,
    fetchAllEvents,
    fetchTicket,
  } = useEventDAO();

  const loadEvents = useCallback(async () => {
    if (!connected) return;
    
    setIsLoadingData(true);
    try {
      const fetchedEvents = await fetchAllEvents();
      setEvents(fetchedEvents || []);
      setIsEventDAOInitialized(Array.isArray(fetchedEvents));
    } catch (err) {
      console.error('Error loading events:', err);
      setEvents([]);
      setIsEventDAOInitialized(false);
    } finally {
      setIsLoadingData(false);
    }
  }, [fetchAllEvents, connected]);

  const loadUserTickets = useCallback(async () => {
    if (!publicKey || events.length === 0) return;
    
    try {
      const tickets = new Map();
      // Process tickets in parallel for better performance
      const ticketPromises = events.map(async (event) => {
        try {
          const ticket = await fetchTicket(event.id, publicKey);
          return [event.id, {
            hasTicket: !!ticket,
            isUsed: ticket?.isUsed || false,
          }];
        } catch {
          return [event.id, { hasTicket: false, isUsed: false }];
        }
      });
      
      const results = await Promise.all(ticketPromises);
      results.forEach(([eventId, ticketData]) => {
        tickets.set(eventId, ticketData);
      });
      
      setUserTickets(tickets);
    } catch (err) {
      console.error('Error loading user tickets:', err);
    }
  }, [publicKey, events, fetchTicket]);

  useEffect(() => {
    if (connected) {
      loadEvents();
    }
  }, [connected, loadEvents]);

  useEffect(() => {
    if (connected && publicKey && events.length > 0) {
      loadUserTickets();
    }
  }, [connected, publicKey, events, loadUserTickets]);

  const handleCreateEvent = async (eventData: {
    title: string;
    description: string;
    maxParticipants: number;
    ticketPrice: number;
  }) => {
    try {
      await createEvent(eventData);
      await loadEvents();
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleBuyTicket = async (eventId: number) => {
    try {
      await buyTicket(eventId);
      await loadUserTickets();
    } catch (err) {
      console.error('Error buying ticket:', err);
    }
  };

  const handleUseTicket = async (eventId: number) => {
    try {
      await submitTicket(eventId);
      await loadUserTickets();
    } catch (error) {
      console.error('Error using ticket:', error);
    }
  };

  const handleInitializeDAO = async () => {
    try {
      await initializeEventDAO();
      setIsEventDAOInitialized(true);
      await loadEvents();
    } catch (err) {
      console.error('Error initializing DAO:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">EventDAO</h1>
              <span className="ml-2 text-sm text-gray-500">Solana Web3 Events</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link href="/submit" className="text-gray-700 hover:text-gray-900 font-medium">Submit</Link>
              <Link href="/explore" className="text-gray-700 hover:text-gray-900 font-medium">Explore</Link>
              <Link href="/leaderboard" className="text-gray-700 hover:text-gray-900 font-medium">Leaderboard</Link>
              <Link href="/wallet" className="text-gray-700 hover:text-gray-900 font-medium">Wallet</Link>
              <Link href="/admin" className="text-gray-700 hover:text-gray-900 font-medium">Admin</Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
            </nav>
            <div className="flex items-center gap-4">
              {connected && (
                <button
                  onClick={handleInitializeDAO}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Initialize DAO'}
                </button>
              )}
              {mounted && <WalletMultiButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!connected ? (
          <div className="text-center py-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <span className="text-6xl font-bold text-gray-900">0</span>
                <span className="text-2xl font-semibold text-gray-600 ml-2">EVENT</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Decentralized Event Verification Market
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Stake tokens on the authenticity of events. Earn rewards when you&apos;re right. 
                Build reputation through accurate event verification and mint NFT proof of attendance.
              </p>
              
              <div className="flex justify-center gap-4 mb-12">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Submit an Event
                </button>
                <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Explore Events
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                  <div className="text-gray-600">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                  <div className="text-gray-600">EVENT Staked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                {mounted && <WalletMultiButton />}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{events.length}</div>
                <div className="text-gray-600">Total Events</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                <div className="text-gray-600">EVENT Staked</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
                <div className="text-gray-600">Active Users</div>
              </div>
            </div>

            {/* Active Events Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Events</h2>
                <Link href="/explore" className="text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>

                    {/* Events Grid */}
                    {isLoadingData ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading events...</p>
                      </div>
                    ) : !isEventDAOInitialized ? (
                      <div className="text-center py-12">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                          <h3 className="text-lg font-semibold text-yellow-800 mb-2">EventDAO Not Initialized</h3>
                          <p className="text-yellow-700 mb-4">To use the application, you need to initialize EventDAO first.</p>
                          <button
                            onClick={handleInitializeDAO}
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            {loading ? 'Initializing...' : 'Initialize EventDAO'}
                          </button>
                        </div>
                      </div>
                    ) : events.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                          <p className="text-gray-500 text-lg mb-4">No active events yet</p>
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                          >
                            Submit the First Event
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onBuyTicket={handleBuyTicket}
                            onUseTicket={handleUseTicket}
                            hasTicket={userTickets.get(event.id)?.hasTicket || false}
                            isTicketUsed={userTickets.get(event.id)?.isUsed || false}
                          />
                        ))}
                      </div>
                    )}
            </div>
          </>
        )}
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}

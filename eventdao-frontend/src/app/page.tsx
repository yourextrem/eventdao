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
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">Tentang</Link>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                EventDAO
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Proof of Event on Solana
              </p>
              <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                Platform event terdesentralisasi yang memungkinkan verifikasi kehadiran 
                dan mint NFT sebagai bukti partisipasi di berbagai acara.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Verifikasi Event</h3>
                  <p className="text-blue-700">Stake dan verifikasi keaslian event secara transparan</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">NFT Attendance</h3>
                  <p className="text-green-700">Mint NFT unik sebagai bukti kehadiran yang dapat dikoleksi</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Reward System</h3>
                  <p className="text-purple-700">Dapatkan reward untuk partisipasi dan verifikasi yang akurat</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                {mounted && <WalletMultiButton />}
                <Link 
                  href="/about" 
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Daftar Event ({events.length})
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Buat Event Baru
              </button>
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
                          <h3 className="text-lg font-semibold text-yellow-800 mb-2">EventDAO Belum Diinisialisasi</h3>
                          <p className="text-yellow-700 mb-4">Untuk menggunakan aplikasi, Anda perlu menginisialisasi EventDAO terlebih dahulu.</p>
                          <button
                            onClick={handleInitializeDAO}
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                          >
                            {loading ? 'Menginisialisasi...' : 'Inisialisasi EventDAO'}
                          </button>
                        </div>
                      </div>
                    ) : events.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Belum ada event yang dibuat.</p>
                        <p className="text-gray-400 mt-2">Klik &quot;Buat Event Baru&quot; untuk memulai!</p>
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

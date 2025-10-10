'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import SimpleWalletButton from '@/components/SimpleWalletButton';
import { CreateEventModal } from '@/components/CreateEventModal';
import { useEventDAO } from '@/hooks/useEventDAO';
import AuthButton from '@/components/AuthButton';

// FAQ Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-black bg-opacity-10 rounded-lg border border-gray-600 backdrop-blur-sm">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-medium">{question}</span>
        <span className={`text-green-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
};

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


  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed-background"></div>
      
      {/* Content */}
      <div className="relative z-10 text-white">
        {/* Header */}
        <header className="bg-transparent border-b border-gray-600 backdrop-blur-sm bg-black bg-opacity-5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/eventdao_letter.png"
                    alt="EventDAO"
                    width={120}
                    height={30}
                    className="mr-8"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </Link>
                 <nav className="hidden md:flex items-center space-x-6">
                   <Link href="/submit" className="text-white hover:text-green-400 font-medium">Submit Event</Link>
                   <Link href="/explore" className="text-white hover:text-green-400 font-medium">Explore Events</Link>
                   <Link href="/leaderboard" className="text-white hover:text-green-400 font-medium">Leaderboard</Link>
                   <Link href="/wallet" className="text-white hover:text-green-400 font-medium">Wallet</Link>
                   <Link href="/profile" className="text-white hover:text-green-400 font-medium">Profile</Link>
                   <Link href="/admin" className="text-white hover:text-green-400 font-medium">Admin</Link>
                   <Link href="/about" className="text-white hover:text-green-400 font-medium">About</Link>
                 </nav>
              </div>
              <div className="flex items-center gap-4">
                <AuthButton />
                {mounted && <SimpleWalletButton />}
              </div>
            </div>
          </div>
        </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Logo */}
            <div className="mb-16">
              <Image
                src="/images/eventdao.png"
                alt="EventDAO Logo"
                width={1200}
                height={300}
                className="mx-auto mb-8"
                style={{ width: 'auto', height: 'auto', maxWidth: '90vw' }}
                priority
                sizes="(max-width: 768px) 90vw, 1200px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">EventDAO Demo</h2>
            <p className="text-gray-300">Watch our introduction video</p>
          </div>
          <div className="aspect-video bg-black bg-opacity-40 rounded-lg backdrop-blur-sm border border-gray-600 overflow-hidden">
            {/* YouTube Embed - EventDAO Demo Video */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/g3ENX3aHlqU?si=j4A6TtO7ksgLO4V5"
              title="EventDAO Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            
            {/* Fallback for local development - comment out when using YouTube */}
            {/* 
            <video
              className="w-full h-full object-cover"
              controls
              preload="auto"
              poster="/images/eventdao_background.png"
            >
              <source src="/videos/Vau1t%20X%20MidEvils.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            */}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                question: "What is EventDAO?",
                answer: "EventDAO is a decentralized platform that allows users to verify real-world events on the Solana blockchain. Users can stake tokens on event authenticity and earn rewards for accurate verification."
              },
              {
                question: "How does event verification work?",
                answer: "Users submit event claims with supporting evidence. The community stakes tokens on whether the event is authentic or not. Resolution happens through APIs, news feeds, or oracles, and winners earn rewards."
              },
              {
                question: "What is a Proof of Attendance NFT?",
                answer: "A Proof of Attendance NFT (POAP) is a unique digital collectible that proves you attended a specific event. These NFTs are minted on Solana and can be collected, traded, or displayed."
              },
              {
                question: "Do I need crypto to use EventDAO?",
                answer: "Yes, you need SOL (Solana's native token) to pay for transaction fees and stake on events. You can get SOL from exchanges or use our faucet for testing."
              },
              {
                question: "Is this gambling or betting?",
                answer: "No, EventDAO is about verifying real-world events, not gambling. It's a prediction market focused on event authenticity verification."
              },
              {
                question: "What kind of events can I submit?",
                answer: "You can submit any verifiable real-world event like concerts, conferences, sports matches, or community gatherings. Events must have clear evidence and resolution criteria."
              },
              {
                question: "How do rewards work?",
                answer: "When you stake correctly on an event's authenticity, you earn a portion of the total staked amount from incorrect stakers. The more accurate you are, the more you earn."
              },
              {
                question: "Why build on Solana?",
                answer: "Solana offers fast, cheap transactions perfect for frequent staking and NFT minting. It also has excellent developer tools and a growing ecosystem."
              }
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Roadmap Design Image with Overlay Text */}
          <div className="relative flex justify-center items-center">
            <Image
              src="/images/roadmap_design.png"
              alt="EventDAO Roadmap Design"
              width={1400}
              height={700}
              className="mx-auto rounded-lg shadow-2xl"
              style={{ width: 'auto', height: 'auto', maxWidth: '90vw' }}
            />
            
            {/* Phase 1 - Foundation (Top Center) */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 md:top-20 lg:top-24">
              <div className="bg-black bg-opacity-80 p-4 rounded-lg border border-green-500 backdrop-blur-sm max-w-xs">
                <h3 className="text-lg font-bold text-green-400 mb-2">Phase 1 - Foundation</h3>
                <p className="text-white text-sm">
                  Core event verification system with staking mechanics, automatic resolution through APIs, 
                  and NFT proof-of-attendance minting. Building the essential infrastructure for trustless event verification.
                </p>
              </div>
            </div>

            {/* Phase 2 - Ecosystem (Middle Center) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black bg-opacity-80 p-4 rounded-lg border border-green-500 backdrop-blur-sm max-w-xs">
                <h3 className="text-lg font-bold text-green-400 mb-2">Phase 2 - Ecosystem</h3>
                <p className="text-white text-sm">
                  Partner with event organizers, venues, and ticketing platforms. Launch community leaderboards, 
                  achievement systems, and sponsor partnerships. Expand beyond crypto-native events.
                </p>
              </div>
            </div>

            {/* Phase 3 - Global Standard (Bottom Center) */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 md:bottom-20 lg:bottom-24">
              <div className="bg-black bg-opacity-80 p-4 rounded-lg border border-green-500 backdrop-blur-sm max-w-xs">
                <h3 className="text-lg font-bold text-green-400 mb-2">Phase 3 - Global Standard</h3>
                <p className="text-white text-sm">
                  Establish EventDAO as the universal standard for verifiable event attendance. Scale to millions 
                  of events worldwide, with seamless integration across all major platforms and industries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />
      </div>
    </div>
  );
}

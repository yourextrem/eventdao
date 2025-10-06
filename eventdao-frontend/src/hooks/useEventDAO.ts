'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Wallet, BN } from '@coral-xyz/anchor';
import { 
  getProgram, 
  getEventDAOPDA, 
  getEventPDA, 
  getTicketPDA, 
  parseLamports 
} from '@/lib/solana';

export const useEventDAO = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize program creation to avoid recreating on every render
  const program = useMemo(() => {
    if (!wallet.publicKey || !wallet.connected) return null;
    return getProgram(wallet as unknown as Wallet);
  }, [wallet]);

  const initializeEventDAO = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [eventDAOPDA] = getEventDAOPDA();
      
      const tx = await (program.methods as any)
        .initialize()
        .accounts({
          eventDao: eventDAOPDA,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('EventDAO initialized:', tx);
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  const createEvent = useCallback(async (eventData: {
    title: string;
    description: string;
    maxParticipants: number;
    ticketPrice: number;
  }) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [eventDAOPDA] = getEventDAOPDA();
      
      // First, fetch the current EventDAO to get the next event ID
      let eventId = 0;
      try {
        const eventDAO: any = await (program.account as any).eventDAO.fetch(eventDAOPDA);
        eventId = eventDAO.totalEvents;
      } catch {
        console.log('EventDAO not found, using eventId = 0');
        eventId = 0;
      }
      
      const [actualEventPDA] = getEventPDA(eventId);
      
      const tx = await (program.methods as any)
        .createEvent(
          eventData.title,
          eventData.description,
          new BN(eventData.maxParticipants),
          new BN(parseLamports(eventData.ticketPrice.toString()))
        )
        .accounts({
          eventDao: eventDAOPDA,
          event: actualEventPDA,
          organizer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Event created:', tx);
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  const buyTicket = useCallback(async (eventId: number) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [eventPDA] = getEventPDA(eventId);
      const [ticketPDA] = getTicketPDA(eventId, wallet.publicKey);
      
      const tx = await (program.methods as any)
        .buyTicket()
        .accounts({
          event: eventPDA,
          ticket: ticketPDA,
          buyer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Ticket purchased:', tx);
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  const submitTicket = useCallback(async (eventId: number) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [ticketPDA] = getTicketPDA(eventId, wallet.publicKey);
      
      const tx = await (program.methods as any)
        .useTicket()
        .accounts({
          ticket: ticketPDA,
          user: wallet.publicKey,
        })
        .rpc();

      console.log('Ticket used:', tx);
      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [program, wallet.publicKey]);

  const fetchEventDAO = useCallback(async () => {
    if (!program) return null;

    try {
      const [eventDAOPDA] = getEventDAOPDA();
      
      // Quick check if account exists
      const accountInfo = await connection.getAccountInfo(eventDAOPDA);
      if (!accountInfo) return null;
      
      // Fetch with timeout
      const eventDAOAccount = (program.account as any).eventDAO || (program.account as any).EventDAO;
      if (!eventDAOAccount) return null;
      
      const eventDAO = await Promise.race([
        eventDAOAccount.fetch(eventDAOPDA),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);
      
      return eventDAO;
    } catch (error) {
      console.error('Error fetching EventDAO:', error);
      return null;
    }
  }, [program, connection]);

  const fetchEvent = useCallback(async (eventId: number) => {
    if (!program) return null;

    try {
      const [eventPDA] = getEventPDA(eventId);
      
      if (!program.account) {
        console.error('Program account not available');
        return null;
      }
      
      const eventAccount = (program.account as any).event || (program.account as any).Event;
      if (!eventAccount) {
        console.error('Event account not found in program');
        return null;
      }
      
      const event = await eventAccount.fetch(eventPDA);
      return {
        id: event.id.toNumber ? event.id.toNumber() : event.id,
        title: event.title,
        description: event.description,
        organizer: event.organizer.toBase58(),
        maxParticipants: event.maxParticipants.toNumber ? event.maxParticipants.toNumber() : event.maxParticipants,
        currentParticipants: event.currentParticipants.toNumber ? event.currentParticipants.toNumber() : event.currentParticipants,
        ticketPrice: event.ticketPrice.toNumber ? event.ticketPrice.toNumber() : event.ticketPrice,
        isActive: event.isActive,
        createdAt: event.createdAt.toNumber ? event.createdAt.toNumber() : event.createdAt,
        bump: event.bump,
      };
    } catch (err) {
      console.error('Error fetching event:', err);
      return null;
    }
  }, [program]);

  const fetchTicket = useCallback(async (eventId: number, owner: PublicKey) => {
    if (!program) return null;

    try {
      const [ticketPDA] = getTicketPDA(eventId, owner);
      
      if (!program.account) {
        console.error('Program account not available');
        return null;
      }
      
      const ticketAccount = (program.account as any).ticket || (program.account as any).Ticket;
      if (!ticketAccount) {
        console.error('Ticket account not found in program');
        return null;
      }
      
      const ticket = await ticketAccount.fetch(ticketPDA);
      return {
        eventId: ticket.eventId.toNumber ? ticket.eventId.toNumber() : ticket.eventId,
        owner: ticket.owner.toBase58(),
        purchaseTime: ticket.purchaseTime.toNumber ? ticket.purchaseTime.toNumber() : ticket.purchaseTime,
        isUsed: ticket.isUsed,
        bump: ticket.bump,
      };
    } catch (err) {
      console.error('Error fetching ticket:', err);
      return null;
    }
  }, [program]);

  const fetchAllEvents = useCallback(async () => {
    if (!program) return [];

    try {
      const eventDAO = await fetchEventDAO();
      if (!eventDAO) return [];

      const events = [];
      const totalEvents = eventDAO.totalEvents.toNumber ? eventDAO.totalEvents.toNumber() : eventDAO.totalEvents;
      for (let i = 0; i < totalEvents; i++) {
        const event = await fetchEvent(i);
        if (event) {
          events.push(event);
        }
      }
      return events;
    } catch (err) {
      console.error('Error fetching all events:', err);
      return [];
    }
  }, [program, fetchEventDAO, fetchEvent]);

  return {
    loading,
    error,
    initializeEventDAO,
    createEvent,
    buyTicket,
    submitTicket,
    fetchEventDAO,
    fetchEvent,
    fetchTicket,
    fetchAllEvents,
  };
};

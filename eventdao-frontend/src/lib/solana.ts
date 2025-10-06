/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import idl from '../idl/eventdao.json';
import config from '../config/env';

// Program ID from environment or default
export const PROGRAM_ID = new PublicKey(config.programId);

// Network configuration from environment
export const NETWORK = config.network;
export const RPC_ENDPOINT = config.rpcEndpoint;

// Connection instance
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Helper function to get program instance
export const getProgram = (wallet: Wallet): Program<any> => {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: 'confirmed',
  });
  
  const program = new Program(idl as any, provider);
  
  return program;
};

// PDA (Program Derived Address) helpers
export const getEventDAOPDA = (): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('event_dao')],
    PROGRAM_ID
  );
};

export const getEventPDA = (eventId: number): [PublicKey, number] => {
  const eventIdBuffer = Buffer.alloc(4);
  eventIdBuffer.writeUInt32LE(eventId, 0);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('event'), eventIdBuffer],
    PROGRAM_ID
  );
};

export const getTicketPDA = (eventId: number, owner: PublicKey): [PublicKey, number] => {
  const eventIdBuffer = Buffer.alloc(4);
  eventIdBuffer.writeUInt32LE(eventId, 0);
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('ticket'),
      eventIdBuffer,
      owner.toBuffer()
    ],
    PROGRAM_ID
  );
};

// Utility functions
export const formatLamports = (lamports: number): string => {
  return (lamports / 1e9).toFixed(4) + ' SOL';
};

export const parseLamports = (sol: string): number => {
  return Math.floor(parseFloat(sol) * 1e9);
};

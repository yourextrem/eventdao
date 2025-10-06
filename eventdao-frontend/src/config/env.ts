// Environment configuration for EventDAO
// These values can be overridden by environment variables

export const config = {
  // Solana Network Configuration
  network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  rpcEndpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com',
  
  // Program Configuration
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID || '8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK',
  
  // Debug Configuration
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true' || false,
  
  // App Configuration
  appName: 'EventDAO',
  appDescription: 'Platform event terdesentralisasi di Solana blockchain',
} as const;

// Validation
if (!config.programId) {
  throw new Error('NEXT_PUBLIC_PROGRAM_ID is required');
}

if (!config.rpcEndpoint) {
  throw new Error('NEXT_PUBLIC_RPC_ENDPOINT is required');
}

export default config;

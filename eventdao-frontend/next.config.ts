import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations for Vercel
  compress: true,
  poweredByHeader: false,
  
  // Output configuration for Vercel
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: false,
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT,
    NEXT_PUBLIC_PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID,
  },
  
  // Webpack optimizations for production
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          solana: {
            test: /[\\/]node_modules[\\/]@solana[\\/]/,
            name: 'solana',
            chunks: 'all',
          },
          anchor: {
            test: /[\\/]node_modules[\\/]@coral-xyz[\\/]/,
            name: 'anchor',
            chunks: 'all',
          },
        },
      };
    }
    
    // Handle Node.js modules for client-side
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

export default nextConfig;

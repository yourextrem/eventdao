import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations for Vercel
  compress: true,
  poweredByHeader: false,
  
  // Output configuration for Vercel
  output: 'standalone',
  
  // Server external packages
  serverExternalPackages: ['@coral-xyz/anchor'],
  
  // Suppress warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Suppress specific warnings
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
         // Image optimization
         images: {
           unoptimized: false,
           dangerouslyAllowSVG: true,
           contentDispositionType: 'attachment',
           contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
           qualities: [25, 50, 75, 90, 100],
           remotePatterns: [
             {
               protocol: 'https',
               hostname: 'api.dicebear.com',
               port: '',
               pathname: '/7.x/avataaars/svg',
             },
           ],
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
      path: false,
      crypto: false,
      stream: false,
      util: false,
      buffer: false,
      process: false,
    };
    
    // Ignore filesystem warnings
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'fs'/,
      /Module not found: Can't resolve 'path'/,
      /Unable to add filesystem/,
      /illegal path/,
      /The resource.*was preloaded using link preload but not used/,
      /Multiple versions of Lit loaded/,
      /Lit is in dev mode/,
      /UnsafeBurnerWalletAdapter/,
    ];
    
    return config;
  },
};

export default nextConfig;

# EventDAO Frontend - Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables**: Configure the required environment variables

## Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables

```bash
# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Program Configuration
NEXT_PUBLIC_PROGRAM_ID=8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK
```

### Optional Variables

```bash
# Enable debug mode
NEXT_PUBLIC_DEBUG=false
```

## Deployment Steps

### 1. Connect GitHub to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `eventdao-frontend` folder as the root directory

### 2. Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `eventdao-frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### 3. Set Environment Variables

In the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable listed above
4. Set them for all environments (Production, Preview, Development)

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at the provided Vercel URL

## Build Verification

Before deploying, ensure the build works locally:

```bash
cd eventdao-frontend
npm install
npm run build
npm run start
```

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `dependencies` not `devDependencies`
2. **Environment Variables**: Ensure all `NEXT_PUBLIC_*` variables are set
3. **TypeScript Errors**: Run `npm run lint` to check for errors
4. **Memory Issues**: Vercel has memory limits, optimize bundle size if needed

### Performance Optimization

- The build is optimized with code splitting
- Solana and Anchor libraries are in separate chunks
- Images are optimized automatically
- CSS is minified and optimized

## Post-Deployment

1. **Test the Application**: Verify all functionality works
2. **Check Console**: Look for any runtime errors
3. **Monitor Performance**: Use Vercel Analytics if needed
4. **Update Domain**: Configure custom domain if required

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Check browser console for errors

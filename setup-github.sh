#!/bin/bash

# EventDAO GitHub Setup Script
# This script will initialize git and prepare for GitHub push

echo "🚀 EventDAO GitHub Setup"
echo "========================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "eventdao-frontend" ]; then
    echo "❌ Error: Please run this script from the eventdao project root directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Project structure verified"

# Initialize git repository
echo "🔧 Initializing git repository..."
git init
git branch -m main

# Add all files
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: EventDAO - Solana Web3 Events Platform

- Complete Next.js + TypeScript frontend
- Solana wallet integration (Phantom, Solflare)  
- Anchor program integration
- Event creation and ticket management
- Responsive UI with Tailwind CSS
- Optimized for Vercel deployment
- Environment configuration
- QA testing suite
- Performance optimizations"

echo "✅ Git repository initialized successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. Add your GitHub remote:"
echo "   git remote add origin https://github.com/yourextrem/eventdao.git"
echo ""
echo "2. Push to GitHub:"
echo "   git push -u origin main"
echo "   (You'll need to authenticate with your GitHub credentials)"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your repository"
echo "   - Set Root Directory to 'eventdao-frontend'"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""
echo "🎉 Ready for GitHub push!"

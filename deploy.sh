#!/bin/bash

echo "🎪 EthCC TipFest Deployment Guide"
echo "================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Please copy .env.example to .env.local and fill in your values:"
    echo "   cp .env.example .env.local"
    echo ""
    echo "🔑 Required environment variables:"
    echo "   - NEXT_PUBLIC_ONCHAINKIT_API_KEY (from Coinbase Developer Platform)"
    echo "   - NEXT_PUBLIC_URL (your deployment URL)"
    echo "   - NEXT_PUBLIC_ICON_URL (your app icon URL)"
    echo ""
    exit 1
fi

echo "✅ Environment file found"

# Check if Node.js version is compatible
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js version compatible: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build the project
echo "🏗️ Building project..."
npm run build

echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "📋 Deployment options:"
echo ""
echo "1️⃣ Vercel (Recommended):"
echo "   npm install -g vercel"
echo "   vercel --prod"
echo ""
echo "2️⃣ Manual deployment:"
echo "   npm start (runs on port 3000)"
echo ""
echo "🔗 Don't forget to:"
echo "   - Update environment variables in your deployment platform"
echo "   - Test your Frame in Warpcast"
echo "   - Submit to Base Builder Quest 7"
echo ""
echo "🏖️ Good luck at EthCC 2025 in Cannes! 🎉"

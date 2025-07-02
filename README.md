# EthCC TipFest 🎪

A Farcaster Frame-based app for EthCC 2025 attendees to send gas-free tips to speakers and organizers. Built for Base Builder Quest 7.

## 🌟 Features

- **Gas-free Tipping**: Send USDC or ETH tips without paying gas fees using Paymaster
- **Real Farcaster Data**: Live speaker data from Neynar API with profiles and verification
- **Smart Search**: Search EthCC speakers by name, username, or company
- **Featured Speakers**: Curated list of EthCC 2025 speakers and organizers
- **Smart Contract**: Deployed EthCCTipFest contract for secure tip handling
- **MiniKit Framework**: Built with OnchainKit and MiniKit for smooth UX
- **EthCC Theme**: Beautiful blue design inspired by EthCC 2025 in Cannes

## 🏗️ Built With

- [Next.js](https://nextjs.org) - React framework
- [MiniKit](https://docs.base.org/builderkits/minikit/overview) - Farcaster Frame SDK
- [OnchainKit](https://www.base.org/builders/onchainkit) - Base blockchain toolkit
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Base Sepolia](https://sepolia.basescan.org) - Test network

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
- Get OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com)
- Get Neynar API key from [Neynar Dashboard](https://neynar.com) for Farcaster data
- Update the URLs to match your deployment

3. **Start development server:**
```bash
npm run dev
```

4. **Open in Warpcast:**
Visit `http://localhost:3000` in Warpcast mobile app or use the Frame validator.

## 📱 How to Use

1. **Connect Wallet**: Sign in with your Farcaster account via MiniKit
2. **Browse Speakers**: Explore real EthCC 2025 speakers with live Farcaster data
3. **Smart Search**: Search by name, username, or company to find recipients
4. **Send Tip**: Choose USDC or ETH amount and add a thank you message
5. **Gas-Free**: Transaction processed without gas fees using Paymaster
6. **View History**: Track your sent and received tips with full details

## 🔧 Smart Contract

**Contract Address (Base Sepolia):** `0xe8833B8e513826A1c2c22f0aD149c64a5871eC43`

### Key Functions:
- `sendTip(to, amount, token, message)` - Send a tip with message
- `getTipsBySender(sender)` - Get tips sent by address
- `getTipsByReceiver(receiver)` - Get tips received by address
- `getTotalTips()` - Get total number of tips

## 🎨 Architecture

### Components:
- **TipForm**: Main tipping interface with recipient selection and amount input
- **SpeakerList**: Featured EthCC speakers and organizers
- **TipHistory**: View sent and received tips with transaction details
- **Smart Contract Integration**: Direct interaction with EthCCTipFest contract

### Tech Stack:
- **Frontend**: Next.js + React + TypeScript
- **Blockchain**: Base Sepolia testnet
- **Wallet**: MiniKit integration with Farcaster
- **Styling**: Tailwind CSS with EthCC blue theme
- **Framework**: MiniKit for Farcaster Frame functionality

## 📦 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel
```

2. **Set Environment Variables:**
In Vercel dashboard, add all variables from `.env.example`

3. **Update URLs:**
Replace localhost URLs with your Vercel deployment URL

### Manual Deployment

1. **Build the project:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

## 🎯 Base Builder Quest 7

This project is built for **Base Builder Quest 7** with the following requirements:

✅ **MiniKit Integration**: Full Farcaster Frame support with wallet connection
✅ **OnchainKit**: Complete integration with Base ecosystem tools  
✅ **Smart Contract**: Custom EthCCTipFest contract for tipping functionality
✅ **Paymaster**: Gas-free transactions for better UX
✅ **Mobile Responsive**: Optimized for Warpcast mobile experience
✅ **EthCC Theming**: Custom blue design for EthCC 2025

## 🌊 Contributing

This project is part of the EthCC 2025 ecosystem. Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Built for EthCC 2025 and Base Builder Quest 7. Open source under MIT License.

## 🏖️ EthCC 2025

Join us in Cannes for EthCC 2025! Use this app to show appreciation to speakers and organizers who make the event amazing.

**Event Details:**
- 📅 July 8-11, 2025
- 📍 Cannes, France
- 🌐 [ethcc.io](https://ethcc.io)

---

Built with 💙 on Base | Powered by MiniKit | Made for EthCC 2025

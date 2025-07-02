# EthCC TipFest - Project Structure

## 🏗️ Architecture Overview

```
ethcc-tipfest/
├── app/                          # Next.js App Router
│   ├── components/              # React components
│   │   ├── TipForm.tsx         # Main tipping interface
│   │   ├── TipHistory.tsx      # Transaction history viewer
│   │   ├── SpeakerList.tsx     # Featured speakers & organizers
│   │   └── DemoComponents.tsx  # Shared UI components
│   ├── api/                    # API routes (notifications)
│   ├── layout.tsx              # Root layout with Frame metadata
│   ├── page.tsx                # Main app page with navigation
│   ├── providers.tsx           # MiniKit & OnchainKit providers
│   ├── globals.css             # Global styles
│   └── theme.css               # EthCC blue theme variables
├── lib/                        # Utility libraries
│   ├── contract.ts             # Smart contract ABI & helpers
│   ├── notification-client.ts  # Notification utilities
│   ├── notification.ts         # Notification types
│   └── redis.ts                # Redis connection
├── public/                     # Static assets
│   ├── .well-known/
│   │   └── farcaster.json      # Farcaster Frame manifest
│   ├── icon.png                # App icon
│   ├── hero.png                # Hero image
│   └── splash.png              # Splash screen
├── .env.example                # Environment variables template
├── deploy.sh                   # Deployment script
└── README.md                   # Complete documentation
```

## 🔧 Key Components

### TipForm.tsx
- Main tipping interface
- Recipient selection (handle or address)
- Token selection (USDC/ETH)
- Amount input and message
- Smart contract interaction
- Transaction status handling

### TipHistory.tsx
- Sent/received tips display
- Transaction details and formatting
- Community statistics
- Responsive tip cards

### SpeakerList.tsx
- Featured EthCC speakers
- Event organizers
- Quick tip recipient selection
- EthCC 2025 branding

### Smart Contract Integration
- Contract: `0xe8833B8e513826A1c2c22f0aD149c64a5871eC43`
- Network: Base Sepolia
- Functions: sendTip, getTips, etc.
- Gas-free transactions via Paymaster

## 🎨 Design System

### Color Palette
- Primary Blue: `#1E3A8A` (EthCC inspired)
- Accent Blue: `#3B82F6`
- Background: White/Dark slate
- Cards: Semi-transparent with blur

### Typography
- Font: Geist (modern, clean)
- Headings: Bold, blue accent
- Body: Readable gray tones

### Components
- Cards: Rounded, shadowed, backdrop blur
- Buttons: Blue primary, ghost variants
- Icons: Consistent stroke weight
- Animations: Smooth transitions

## 📱 Mobile-First Design

- Optimized for Warpcast mobile app
- Touch-friendly button sizes
- Responsive grid layouts
- Safe area insets handling
- Frame-compatible dimensions

## 🚀 Performance Features

- Server-side rendering (Next.js)
- Optimized bundle size
- Image optimization
- Type-safe development
- Error boundaries

## 🔐 Security

- Environment variable protection
- Type-safe contract interactions
- Input validation
- Address format checking
- Transaction confirmation flows

## 🎯 Base Builder Quest 7 Compliance

✅ MiniKit integration with Farcaster Frame support
✅ OnchainKit for Base ecosystem tools
✅ Custom smart contract deployment
✅ Paymaster for gas-free transactions
✅ Mobile-responsive design for Warpcast
✅ EthCC 2025 themed UI/UX
✅ Complete documentation and deployment guide

Built with 💙 for EthCC 2025 in Cannes, France

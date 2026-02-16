# HODL Holdings

Frontend for Sultan L1 Native DEX and Token Factory.

## Features

- **Swap** - Trade tokens instantly with zero gas fees
- **Liquidity Pools** - Provide liquidity and earn trading fees
- **Token Factory** - Create custom tokens on Sultan L1

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Configuration

Set the RPC endpoint via environment variable:

```bash
VITE_RPC_URL=https://rpc.sltn.io npm run dev
```

Or create a `.env.local` file:

```env
VITE_RPC_URL=https://rpc.sltn.io
```

## Wallet Integration

This frontend integrates with the **Sultan Wallet** browser extension.

The wallet provides:
- Ed25519 signature generation
- Account management  
- Transaction signing and broadcasting

Install Sultan Wallet from the Chrome Web Store to use DeFi features.

### Wallet API

```javascript
// Connect wallet
const { address, publicKey } = await window.sultan.connect();

// Sign a message
const { signature, publicKey } = await window.sultan.signMessage(message);

// Send a transaction
const { txHash } = await window.sultan.sendTransaction(tx);
```

## Architecture

```
src/
├── api/
│   └── defiApi.ts       # RPC client + wallet integration
├── components/
│   └── index.tsx        # Shared UI components
├── pages/
│   ├── SwapPage.tsx     # Token swap interface
│   ├── PoolsPage.tsx    # Liquidity pools
│   └── LaunchpadPage.tsx # Token creation
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## API Endpoints

The frontend connects to Sultan L1 RPC:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tokens/list` | GET | List all tokens |
| `/tokens/create` | POST | Create new token |
| `/dex/pools` | GET | List liquidity pools |
| `/dex/swap` | POST | Execute swap |
| `/dex/add_liquidity` | POST | Add liquidity |
| `/dex/remove_liquidity` | POST | Remove liquidity |

## Deployment

### Replit

1. Import this repo to Replit
2. Click "Run" - it will auto-install and start
3. Deploy using Replit's deployment feature

### Vercel / Netlify

```bash
npm run build
# Deploy the `dist` folder
```

## License

MIT

# Crowd Funding DApp - Client

A React + TypeScript frontend for the Crowd Funding smart contract DApp.

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or another Web3 wallet browser extension

### Installation

```bash
cd client
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This opens the app at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Configuration

### Connect Your Contract

1. Deploy the CrowdFunding contract from the `web3/` folder
2. Copy the deployed contract address
3. Update `src/utils/contract.ts`:
   ```typescript
   export const CONTRACT_ADDRESSES = {
     CrowdFunding: '0x...your-contract-address',
   }
   ```

### Network Configuration

The app connects to the network your wallet is connected to. Make sure to:
- Add the network to MetaMask if needed (e.g., Sepolia, Arbitrum, Polygon)
- Have testnet ETH to interact with the contract

## Features

- **Connect Wallet**: Connect your MetaMask or Web3 wallet
- **Create Campaign**: Start a new fundraising campaign
- **Browse Campaigns**: View active campaigns
- **Contribute**: Donate to campaigns
- **Track Progress**: See funding progress and goals

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx           # Main component
│   ├── App.css           # Styles
│   ├── main.tsx          # React entry
│   ├── index.css         # Global styles
│   ├── vite-env.d.ts     # Vite types
│   └── utils/
│       └── contract.ts   # Contract interaction
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .eslintrc.cjs
```

## Next Steps

1. Deploy the CrowdFunding contract
2. Update the contract address in `src/utils/contract.ts`
3. Extend the UI with:
   - Campaign details page
   - Campaign management dashboard
   - Transaction history
   - Wallet balance display
   - Fund withdrawal functionality
4. Add error handling and loading states
5. Implement better state management (Context API or Redux)

## Troubleshooting

**"Please install MetaMask"**
- Install MetaMask browser extension from https://metamask.io

**"No provider found"**
- Ensure MetaMask is installed and enabled
- Check that you're on a supported network

**"Contract call failed"**
- Verify the contract address is correct
- Ensure the contract is deployed on your current network
- Check that you have gas for the transaction

## Learn More

- [React Documentation](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Ethers.js](https://docs.ethers.org)
- [MetaMask Docs](https://docs.metamask.io)
- [Vite](https://vitejs.dev)

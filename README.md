# Crowd Funding DApp

A full-stack decentralized crowdfunding application built with Solidity smart contracts, Hardhat, and a React + TypeScript frontend powered by thirdweb.

## Repository Overview

This repository contains:

- **Smart contract layer** in `crowd-funding-dapp/web3`
- **Frontend client** in `crowd-funding-dapp/client`
- **Architecture and workflow diagrams** in `crowd-funding-dapp/*.png`

The app allows users to:

- Create crowdfunding campaigns
- Browse and view campaign details
- Contribute funds to campaigns
- Stop campaigns and withdraw funds (campaign owner)
- Track campaign progress and donations

## Tech Stack

### Smart Contracts (`web3`)

- Solidity `0.8.28`
- Hardhat `3`
- Hardhat Ignition (deployment)
- Ethers.js `v6`
- Mocha + Chai (tests)
- Optional thirdweb deployment script

### Frontend (`client`)

- React `18`
- TypeScript
- Vite
- React Router
- thirdweb SDK
- ESLint

## Prerequisites

Install the following before starting:

- **Node.js** `18+` (recommended `20+`)
- **npm** (or pnpm/yarn if preferred)
- A Web3 wallet (for example MetaMask)
- Sepolia test ETH (for testnet transactions)

## Project Structure

```text
.
├── README.md
└── crowd-funding-dapp/
    ├── client/                 # React + TypeScript frontend
    ├── web3/                   # Hardhat contracts, tests, deployment scripts
    ├── 01-system-architecture.png
    ├── 02-create-campaign-workflow.png
    ├── 03-fund-tier-workflow.png
    ├── 04-campaign-lifecycle-state.png
    ├── 05-contract-data-flow.png
    └── 06-ci-contracts-workflow.png
```

## Quick Start

From repository root:

```bash
cd crowd-funding-dapp
```

Install dependencies:

```bash
# Smart contract workspace
cd web3
npm install

# Frontend workspace
cd ../client
npm install
```

## Environment Configuration

### Frontend (`client/.env`)

Create or update `crowd-funding-dapp/client/.env` with values for your environment:

```env
VITE_CONTRACT_ADDRESS=<deployed_crowdfunding_contract_address>
VITE_NETWORK_ID=11155111
VITE_RPC_URL=<your_sepolia_rpc_url>
VITE_THIRDWEB_CLIENT_ID=<your_thirdweb_client_id>
VITE_THIRDWEB_SECRET_KEY=<your_thirdweb_secret_key>
VITE_DEBUG_THIRDWEB=false
```

### Smart Contracts (`web3/.env`, optional)

For Sepolia deployment, provide a private key (without sharing it publicly):

```env
SEPOLIA_PRIVATE_KEY=<64_hex_characters_without_0x>
# or
PRIVATE_KEY=<64_hex_characters_without_0x>
```

For thirdweb deployment script:

```env
THIRDWEB_SECRET_KEY=<your_thirdweb_secret_key>
```

## Running the Smart Contract Project

From `crowd-funding-dapp/web3`:

### Run tests

```bash
npm test
```

### Deploy locally (Hardhat Ignition)

```bash
npm run deploy:local
```

### Deploy to Sepolia

```bash
npm run deploy:sepolia
```

### Deploy with thirdweb script

```bash
npm run deploy:thirdweb
```

## Running the Frontend

From `crowd-funding-dapp/client`:

### Start development server

```bash
npm run dev
```

App runs on `http://localhost:5173` by default.

### Build production bundle

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint frontend

```bash
npm run lint
```

## Typical Local Development Flow

1. Deploy the contract from `web3`
2. Update `VITE_CONTRACT_ADDRESS` in `client/.env`
3. Start frontend with `npm run dev`
4. Connect wallet to Sepolia and interact with the app

## Contract Notes

The `CrowdFunding` contract (`web3/contracts/CrowdFunding.sol`) supports:

- `createCampaign(...)`
- `donateToCampaign(uint256 _id)`
- `withdrawFunds(uint256 _id)`
- `stopCampaign(uint256 _id)`
- `getDonators(uint256 _id)`
- `getCampaigns()`

## Troubleshooting

- **Missing env variables**: ensure all required `VITE_*` values are present in `client/.env`.
- **Wallet/network mismatch**: connect wallet to Sepolia (`11155111`).
- **Sepolia deployment fails**: verify your private key format and account balance.
- **thirdweb read/deploy errors**: verify valid thirdweb client/secret keys.

## Security Notes

- Never commit real secrets (private keys or API keys) to git.
- Rotate any exposed keys immediately.
- Use test accounts and testnet funds for local development.

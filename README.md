# DecentraMarket — Decentralised Marketplace dApp

A full-stack decentralised marketplace built on Ethereum supporting fixed-price sales and English auctions with buyer protection through escrow.

![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Purpose

DecentraMarket demonstrates a trustless peer-to-peer marketplace where:
- **Sellers** list items for fixed prices or auctions
- **Buyers** purchase with built-in escrow protection
- **All transactions** are recorded immutably on Ethereum
- **No intermediary** holds custody of funds

## Scope

This is a **demonstration/educational project** for exploring dApp development patterns. It is deployed on the Sepolia testnet and is not intended for production use with real funds.

## Audience

- Developers learning Solidity and dApp architecture
- Students studying blockchain technology
- Anyone interested in understanding Web3 marketplace mechanics

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Smart Contract Marketplace** | Trustless transactions via Ethereum smart contracts |
| **Escrow System** | 14-day buyer protection with delivery confirmation |
| **Fixed-Price Sales** | Instant purchases at set prices |
| **English Auctions** | Time-limited competitive bidding (1 hour – 30 days) |
| **IPFS Storage** | Decentralised storage for images and metadata via Pinata |
| **MetaMask Integration** | Wallet connection and transaction signing |
| **Platform Fees** | Configurable fee system (default 2.5%) |
| **User Profiles** | Track listings, escrow items, and sales history |

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.24 — Contract language
- **Hardhat** — Development environment and testing
- **OpenZeppelin** — Secure base contracts (Ownable, ReentrancyGuard)
- **TypeChain** — TypeScript bindings for contracts

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Type safety
- **TailwindCSS v4** — Utility-first styling
- **ethers.js v6** — Ethereum library

### Storage & Services
- **IPFS** — Decentralised content storage
- **Pinata** — IPFS pinning service
- **Alchemy/Infura** — RPC provider (Sepolia)

---

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH ([Alchemy Faucet](https://sepoliafaucet.com/))
- Pinata account with JWT token

---

## 🔧 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Jarlarex/Project400.git
cd Project400
npm install
cd frontend && npm install && cd ..
```

### 2. Configure Environment

Create `.env` in the root directory:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_deployer_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Create `frontend/.env.local`:

```env
PINATA_JWT=your_pinata_jwt_token
```

### 3. Run Locally (Hardhat)

Terminal 1 — Start local blockchain:
```bash
npm run node
```

Terminal 2 — Deploy contracts:
```bash
npm run deploy:local
```

Terminal 3 — Start frontend:
```bash
cd frontend && npm run dev
```

Open http://localhost:3000 and connect MetaMask to `Localhost 8545` (Chain ID: 31337).

### 4. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

---

## 📁 Project Structure

```
Project400/
├── contracts/              # Solidity smart contracts
│   ├── Marketplace.sol     # Main marketplace contract
│   └── interfaces/         # Contract interfaces
├── test/                   # Hardhat test suite
├── scripts/                # Deployment and utility scripts
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Pages and API routes
│   │   ├── components/    # React components
│   │   ├── contexts/      # Wallet context
│   │   ├── hooks/         # useMarketplace hook
│   │   └── lib/           # IPFS utilities, constants
├── deployments/           # Deployment artefacts
├── docs/                  # Documentation
└── hardhat.config.ts      # Hardhat configuration
```

---

## 🧪 Testing

Run the test suite (29+ tests):

```bash
npm test
```

Tests cover:
- Contract deployment and initialisation
- Fixed-price listing creation and purchases
- Auction lifecycle (create, bid, end, settle)
- Escrow flow (initiate, confirm, release)
- Platform fee management
- Security constraints and edge cases

---

## 📄 Deployed Contract

| Network | Address | Verified |
|---------|---------|----------|
| Sepolia | `0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b` | [View on Etherscan](https://sepolia.etherscan.io/address/0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b#code) |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Requirements](docs/01-requirements.md) | Problem statement, goals, functional requirements |
| [System Architecture](docs/02-system-architecture.md) | High-level architecture and trust model |
| [Data & Storage](docs/03-data-and-storage.md) | On-chain vs off-chain data, IPFS metadata schema |
| [API & Contracts](docs/04-api-and-contracts.md) | Smart contract functions, events, failure modes |
| [Sequence Flows](docs/05-sequence-flows.md) | Mermaid diagrams for key user journeys |
| [Deployment & Ops](docs/06-deployment-and-ops.md) | Environment setup, deployment instructions |
| [Testing](docs/07-testing.md) | Testing strategy and coverage |
| [Glossary](docs/08-glossary.md) | Terminology definitions |
| [Literature Review Blueprint](docs/09-literature-review-blueprint.md) | Academic overview of technologies |
| [Architecture Overview](ARCHITECTURE.md) | System design decisions |
| [Security](SECURITY.md) | Threat model and mitigations |
| [Contributing](CONTRIBUTING.md) | Contribution guidelines |
| [Changelog](CHANGELOG.md) | Version history |

---

## 🔐 Security

- **ReentrancyGuard** — Protection against reentrancy attacks
- **Ownable** — Admin functions restricted to contract owner
- **Input Validation** — All user inputs validated on-chain
- **Escrow Pattern** — Funds held by contract until conditions met

See [SECURITY.md](SECURITY.md) for the full threat model.

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Iarfhlaith Feeney (Jarlarex)** — S00238682

---

**Built with Ethereum, Next.js, and IPFS**

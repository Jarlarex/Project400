# DecentraMarket

A decentralised marketplace dApp built on Ethereum with fixed-price sales, auctions, and escrow protection.

**Deployed Contract (Sepolia):** `0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b` ([Etherscan](https://sepolia.etherscan.io/address/0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b#code))

---

## Quick Start (Local Development)

### Prerequisites
- Node.js >= 18
- MetaMask browser extension

### 1. Install Dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Set Up Environment

Create `.env` in root:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

Create `frontend/.env.local`:
```env
PINATA_JWT=your_pinata_jwt_token
```

See [docs/SETUP.md](docs/SETUP.md) for detailed API key setup instructions.

### 3. Run Locally

**Terminal 1** — Start local blockchain:
```bash
npm run node
```

**Terminal 2** — Deploy contracts:
```bash
npm run deploy:local
```

**Terminal 3** — Start frontend:
```bash
cd frontend && npm run dev
```

Open http://localhost:3000

### 4. Configure MetaMask
- Network: **Localhost 8545**
- Chain ID: **31337**
- RPC URL: **http://127.0.0.1:8545**

Import a test account using one of the private keys shown when you ran `npm run node`.

---

## Deploy to Sepolia

```bash
npm run deploy:sepolia
```

Make sure your wallet has Sepolia ETH (get from [Alchemy Faucet](https://sepoliafaucet.com/)).

---

## Run Tests

```bash
npm test
```

---

## Project Structure

```
Project400/
├── contracts/          # Solidity smart contracts
├── frontend/           # Next.js app
├── scripts/            # Deployment scripts
├── test/               # Hardhat tests
├── deployments/        # Deployed contract addresses
└── docs/               # Documentation (gitignored)
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run node` | Start local Hardhat blockchain |
| `npm run deploy:local` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm test` | Run contract tests |
| `npm run compile` | Compile contracts |
| `cd frontend && npm run dev` | Start frontend dev server |
| `cd frontend && npm run build` | Build frontend for production |

---

## Documentation

All detailed documentation is in the `docs/` folder:
- [Setup Guide](docs/SETUP.md) — API keys and configuration
- [Architecture](docs/ARCHITECTURE.md) — System design
- [Security](docs/SECURITY.md) — Threat model
- [Contributing](docs/CONTRIBUTING.md) — Contribution guidelines
- [Changelog](docs/CHANGELOG.md) — Version history

---

## Tech Stack

- **Smart Contracts:** Solidity 0.8.24, Hardhat, OpenZeppelin
- **Frontend:** Next.js 14, TypeScript, TailwindCSS v4, ethers.js v6
- **Storage:** IPFS via Pinata

---

**Author:** Iarfhlaith Feeney (S00238682)

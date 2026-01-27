# DecentraMarket - Decentralized Marketplace on Blockchain

A full-stack decentralized marketplace built on Ethereum, allowing users to list items for sale, participate in auctions, and transact with cryptocurrency. The project features smart contracts for secure transactions, MetaMask wallet integration, and IPFS for decentralized storage.

## Features

- **Fixed Price Sales**: List items at a set price for instant purchase
- **English Auctions**: Time-limited bidding with minimum increment requirements
- **Wallet Integration**: Connect with MetaMask for seamless transactions
- **IPFS Storage**: Decentralized storage for item images and metadata via Pinata
- **Transaction History**: View your listings, purchases, and auction activity
- **Responsive Design**: Modern, cyberpunk-inspired UI that works on all devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Solidity 0.8.24, Hardhat, OpenZeppelin |
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Web3 | ethers.js v6, MetaMask |
| Storage | IPFS via Pinata |
| Testing | Hardhat/Chai |
| Network | Sepolia Testnet (default) |

## Project Structure

```
Project400/
├── contracts/                 # Solidity smart contracts
│   ├── Marketplace.sol        # Main marketplace logic
│   └── interfaces/
│       └── IMarketplace.sol   # Interface definitions
├── scripts/                   # Deployment scripts
│   └── deploy.ts
├── test/                      # Contract tests
│   └── Marketplace.test.ts
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   ├── contexts/         # Wallet context
│   │   ├── hooks/            # Custom Web3 hooks
│   │   └── lib/              # Utilities, IPFS, contracts
├── deployments/              # Deployment artifacts
├── hardhat.config.ts         # Hardhat configuration
└── package.json
```

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **MetaMask** browser extension
3. **Sepolia testnet ETH** (get from [faucet](https://sepoliafaucet.com))
4. **Pinata account** (free tier) for IPFS
5. **Alchemy/Infura API key** for Sepolia RPC

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Project400
```

2. Install root dependencies (Hardhat):
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Create environment file:
```bash
cp env.example .env
```

5. Configure your `.env` file:
```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Pinata API keys for IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

6. For the frontend, create `frontend/.env.local`:
```env
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud
```

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Start Local Blockchain

In one terminal:
```bash
npm run node
```

### Deploy to Local Network

In another terminal:
```bash
npm run deploy:local
```

### Start Frontend Development Server

```bash
npm run frontend:dev
```

The app will be available at `http://localhost:3000`

## Deployment to Sepolia

1. Ensure your `.env` file has valid Sepolia configuration
2. Ensure your wallet has Sepolia ETH for gas
3. Deploy:
```bash
npm run deploy:sepolia
```

The deployment script will:
- Deploy the Marketplace contract
- Verify the contract on Etherscan
- Save deployment info to `deployments/sepolia.json`
- Copy the ABI to the frontend

## Smart Contract

### Marketplace.sol

The main contract handles:

- **Listing Creation**: Users can create fixed-price or auction listings
- **Fixed Price Purchases**: Direct buy at listed price
- **Auction Bidding**: Place bids with 5% minimum increment
- **Escrow**: Funds held securely until transaction completion
- **Platform Fee**: 2.5% fee on successful sales

Key functions:
```solidity
function createListing(string metadataURI, uint256 price, bool isAuction, uint256 duration)
function buyItem(uint256 listingId) payable
function placeBid(uint256 listingId) payable
function endAuction(uint256 listingId)
function cancelListing(uint256 listingId)
```

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with features overview |
| `/explore` | Browse all listings with search/filter |
| `/listing/[id]` | Individual listing detail page |
| `/create` | Create new listing form |
| `/profile` | User dashboard with listings |

## Testing

The test suite covers:
- Contract deployment
- Fixed price listing creation and purchase
- Auction creation, bidding, and completion
- Listing cancellation
- Platform fee management
- Edge cases and access control

Run with coverage:
```bash
npm run test:coverage
```

## Security Considerations

- **ReentrancyGuard**: Protects against reentrancy attacks
- **Ownable**: Admin functions restricted to owner
- **Input Validation**: All inputs validated on-chain
- **Escrow Pattern**: Funds held securely during transactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

ISC License

## Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Pinata IPFS](https://docs.pinata.cloud/)

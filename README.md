# Decentralized Marketplace dApp

A full-stack decentralized marketplace built on Ethereum blockchain with support for fixed-price sales and English auctions. Built with Solidity, Hardhat, Next.js, and IPFS.

## 🚀 Features

- **Smart Contract Marketplace**: Secure, trustless transactions powered by Ethereum
- **Fixed-Price Listings**: Buy items instantly at a set price
- **English Auctions**: Competitive bidding system with time-limited auctions
- **IPFS Storage**: Decentralized storage for listing images and metadata via Pinata
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Real-time Updates**: Dynamic UI reflecting blockchain state
- **Platform Fee System**: 2.5% platform fee on successful sales
- **User Profiles**: Track your listings and transaction history

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.24
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **ethers.js** - Ethereum interaction

### Frontend
- **Next.js** 14 - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ethers.js** v6 - Web3 integration

### Storage
- **IPFS** - Decentralized file storage
- **Pinata** - IPFS pinning service

## 📋 Prerequisites

- Node.js >= 18.0.0
- MetaMask browser extension
- Sepolia testnet ETH (for deployment)
- Pinata API credentials

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Jarlarex/Project400.git
cd Project400
```

2. Install root dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Create `.env` file in the root directory:
```env
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
npm test
```

All 29+ tests cover:
- Contract deployment
- Fixed-price listings
- Auction functionality
- Platform fee management
- Security features

## 🚀 Deployment

### Local Development (Hardhat Network)

1. Start local Hardhat node:
```bash
npm run node
```

2. Deploy contracts (in a new terminal):
```bash
npm run deploy:local
```

3. Start the frontend:
```bash
cd frontend
npm run dev
```

4. Configure MetaMask:
   - Network: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

### Sepolia Testnet

1. Get Sepolia ETH from a faucet
2. Configure `.env` with your credentials
3. Deploy:
```bash
npm run deploy:sepolia
```

4. The contract will be automatically verified on Etherscan

## 📁 Project Structure

```
Project400/
├── contracts/              # Solidity smart contracts
│   ├── Marketplace.sol     # Main marketplace contract
│   └── interfaces/         # Contract interfaces
├── test/                   # Contract tests
├── scripts/                # Deployment and utility scripts
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Wallet)
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities and constants
├── deployments/           # Deployment artifacts
└── hardhat.config.ts      # Hardhat configuration
```

## 🎯 Smart Contract Features

- **ReentrancyGuard**: Protection against reentrancy attacks
- **Ownable**: Admin functions for platform management
- **Event Emission**: Comprehensive logging for off-chain indexing
- **Gas Optimized**: Efficient storage and operations
- **Upgradeable Fee System**: Dynamic platform fee adjustment

## 🔐 Security

- OpenZeppelin battle-tested contracts
- Comprehensive test coverage
- Reentrancy protection
- Input validation and error handling
- Etherscan verification for transparency

## 📄 Smart Contract (Sepolia)

- **Contract Address**: `0xbF648124933b5f344eb85Ef22AAaB97b489a5DF6`
- **Network**: Sepolia Testnet
- **Verified**: [View on Etherscan](https://sepolia.etherscan.io/address/0xbF648124933b5f344eb85Ef22AAaB97b489a5DF6#code)

## 🎨 Frontend Features

- Responsive design for all devices
- Real-time wallet integration
- IPFS image uploads
- Search and filter listings
- Category-based navigation
- User dashboard with transaction history

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Ethereum, Next.js, and IPFS**

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-01-27

### Added

#### Smart Contract
- **Marketplace.sol** — Core marketplace contract with:
  - Fixed-price listing creation and purchase
  - English auction system with minimum bid increment (5%)
  - Escrow system with 14-day buyer protection period
  - Platform fee system (2.5% default, max 10%)
  - Listing cancellation (seller only, no bids for auctions)
  - Pull-pattern bid withdrawals for outbid users

- **IMarketplace.sol** — Interface defining:
  - Listing struct with status enum (Active, Sold, Cancelled, InEscrow)
  - Event definitions for all state changes
  - Function signatures for external interactions

#### Frontend
- **Next.js 14 Application** with:
  - Home page with feature overview
  - Explore page with listing grid, search, and type filters
  - Create listing page with IPFS upload
  - Individual listing detail pages
  - User profile with escrow notification section

- **Wallet Integration**:
  - MetaMask connection via WalletContext
  - Network detection (Sepolia, Hardhat local)
  - Balance display and address copying

- **IPFS Integration**:
  - Server-side upload API route (`/api/ipfs/upload`)
  - Pinata REST API integration with JWT auth
  - Multiple IPFS gateway fallbacks for retrieval
  - CID validation helper

- **Components**:
  - ListingCard with type badges and status indicators
  - IpfsImage with automatic gateway fallback
  - Header with wallet connection
  - Footer with links

#### Testing
- Comprehensive Hardhat test suite (29+ tests) covering:
  - Contract deployment and initialisation
  - Fixed-price listing lifecycle
  - Auction creation, bidding, and settlement
  - Escrow initiation and confirmation
  - Platform fee management
  - Access control and edge cases

#### Documentation
- README with quick start guide
- ARCHITECTURE.md with system design
- SECURITY.md with threat model
- CONTRIBUTING.md with guidelines
- Full `/docs` folder with detailed documentation

#### Deployment
- Deployment scripts for Hardhat local and Sepolia
- Automatic ABI copy to frontend
- Etherscan verification on testnet deployment

### Technical Details

- Solidity version: 0.8.24
- OpenZeppelin Contracts: 5.0.0
- Next.js: 14.2.16
- ethers.js: 6.16.0
- TailwindCSS: 4.x

### Known Limitations

- No dispute resolution mechanism beyond escrow timeout
- IPFS availability depends on Pinata pinning
- No upgrade mechanism for deployed contracts
- Testnet only (not audited for mainnet)

---

## [Unreleased]

### Planned
- [ ] ERC-721 NFT support
- [ ] Multi-currency support (ERC-20 tokens)
- [ ] Dispute resolution system
- [ ] Seller reputation scoring
- [ ] Push notifications for escrow events

# Requirements Specification

## Purpose

Define the functional and non-functional requirements for the DecentraMarket decentralised marketplace.

## Scope

Covers problem statement, user roles, requirements, assumptions, and acceptance criteria.

## Audience

Developers, project stakeholders, and academic reviewers.

---

## 1. Problem Statement

Traditional online marketplaces suffer from several issues:
- **Centralised Control**: Platforms can ban users, freeze funds, or change policies arbitrarily
- **High Fees**: Platform fees of 10-20% reduce seller margins
- **Trust Requirements**: Buyers must trust the platform to hold funds fairly
- **Data Ownership**: User data is owned and monetised by the platform
- **Geographic Restrictions**: Many platforms exclude users from certain regions

### Proposed Solution

A decentralised marketplace on Ethereum that:
- Operates without a central authority
- Uses smart contracts for trustless transactions
- Provides transparent, immutable transaction records
- Enables global participation via cryptocurrency
- Implements buyer protection through on-chain escrow

---

## 2. Goals and Non-Goals

### Goals

| ID | Goal | Priority |
|----|------|----------|
| G1 | Enable peer-to-peer trading without intermediaries | High |
| G2 | Provide buyer protection via escrow mechanism | High |
| G3 | Support both fixed-price and auction sale formats | High |
| G4 | Store listing metadata on decentralised storage (IPFS) | High |
| G5 | Integrate with standard Ethereum wallets (MetaMask) | High |
| G6 | Demonstrate dApp architecture patterns | Medium |
| G7 | Provide responsive web interface | Medium |

### Non-Goals

| ID | Non-Goal | Rationale |
|----|----------|-----------|
| NG1 | Production mainnet deployment | Educational project, not audited |
| NG2 | Multi-chain support | Scope limitation, single chain focus |
| NG3 | Fiat currency integration | Adds regulatory complexity |
| NG4 | Mobile native applications | Web-first approach |
| NG5 | Dispute arbitration system | Beyond current scope |
| NG6 | NFT-specific marketplace features | Generic marketplace focus |

---

## 3. User Roles

### Seller

**Description**: User who lists items for sale.

**Capabilities**:
- Create fixed-price listings
- Create auction listings with duration
- View items in escrow awaiting shipment
- Release escrow funds after deadline
- Cancel listings (if no bids for auctions)
- View transaction history

### Buyer

**Description**: User who purchases items.

**Capabilities**:
- Browse and search listings
- Purchase fixed-price items with escrow
- Place bids on auctions
- Confirm delivery to release funds
- Withdraw outbid amounts
- View purchase history

### Platform Owner

**Description**: Contract deployer with administrative capabilities.

**Capabilities**:
- Update platform fee (up to 10% maximum)
- Withdraw accumulated platform fees
- No ability to modify user funds or listings

---

## 4. Functional Requirements

### FR1: Wallet Connection

| ID | Requirement |
|----|-------------|
| FR1.1 | System shall detect MetaMask installation |
| FR1.2 | System shall request wallet connection via EIP-1193 |
| FR1.3 | System shall display connected address (shortened) |
| FR1.4 | System shall display ETH balance |
| FR1.5 | System shall detect and display current network |
| FR1.6 | System shall handle account switching events |

### FR2: Listing Creation

| ID | Requirement |
|----|-------------|
| FR2.1 | User shall upload item image (PNG, JPG, GIF ≤10MB) |
| FR2.2 | User shall provide item name and description |
| FR2.3 | User shall specify price in ETH |
| FR2.4 | User shall choose listing type (fixed or auction) |
| FR2.5 | For auctions, user shall specify duration (1 hour – 30 days) |
| FR2.6 | Image and metadata shall be uploaded to IPFS |
| FR2.7 | Listing shall be created on-chain with IPFS URI |

### FR3: Fixed-Price Purchase

| ID | Requirement |
|----|-------------|
| FR3.1 | Buyer shall initiate purchase with escrow |
| FR3.2 | System shall hold funds in contract for 14 days |
| FR3.3 | Buyer shall be able to confirm delivery |
| FR3.4 | Seller shall receive funds minus platform fee upon confirmation |
| FR3.5 | Seller shall be able to release escrow after deadline |
| FR3.6 | Excess payment shall be refunded automatically |

### FR4: Auction

| ID | Requirement |
|----|-------------|
| FR4.1 | Bidders shall place bids ≥ starting price (first bid) |
| FR4.2 | Subsequent bids shall be ≥5% higher than current highest |
| FR4.3 | Previous highest bidder's funds shall be available for withdrawal |
| FR4.4 | Auction shall end at specified time |
| FR4.5 | Winner's payment shall transfer to seller minus fee |
| FR4.6 | Auctions with no bids shall be cancelled |

### FR5: Listing Management

| ID | Requirement |
|----|-------------|
| FR5.1 | Seller shall be able to cancel active fixed-price listings |
| FR5.2 | Seller shall be able to cancel auctions with no bids |
| FR5.3 | Auctions with bids shall not be cancellable |
| FR5.4 | Cancelled listings shall not be purchasable |

### FR6: User Profile

| ID | Requirement |
|----|-------------|
| FR6.1 | User shall view their listings by status |
| FR6.2 | User shall see count of active, in-escrow, sold items |
| FR6.3 | User shall see total sales volume |
| FR6.4 | In-escrow items shall show buyer address and deadline |

---

## 5. Non-Functional Requirements

### NFR1: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1.1 | Page load time | < 3 seconds |
| NFR1.2 | Transaction confirmation | Chain dependent (~15s Sepolia) |
| NFR1.3 | IPFS upload time | < 30 seconds for 10MB file |

### NFR2: Security

| ID | Requirement |
|----|-------------|
| NFR2.1 | Contract shall use reentrancy protection |
| NFR2.2 | API keys shall not be exposed to client |
| NFR2.3 | Input validation shall occur on-chain |
| NFR2.4 | Contract source shall be verified on Etherscan |

### NFR3: Usability

| ID | Requirement |
|----|-------------|
| NFR3.1 | Interface shall be responsive (mobile, tablet, desktop) |
| NFR3.2 | Loading states shall be clearly indicated |
| NFR3.3 | Error messages shall be human-readable |
| NFR3.4 | Transaction status shall be clearly communicated |

### NFR4: Reliability

| ID | Requirement |
|----|-------------|
| NFR4.1 | IPFS retrieval shall fallback to multiple gateways |
| NFR4.2 | Contract data shall be immutable and persistent |
| NFR4.3 | Frontend shall gracefully handle RPC failures |

---

## 6. Assumptions

| ID | Assumption |
|----|------------|
| A1 | Users have MetaMask installed and configured |
| A2 | Users possess Sepolia ETH for transactions |
| A3 | Users understand basic cryptocurrency concepts |
| A4 | Pinata service remains available for IPFS pinning |
| A5 | Ethereum Sepolia testnet remains operational |
| A6 | RPC provider (Alchemy/Infura) remains available |

---

## 7. Acceptance Criteria

### AC1: Wallet Connection

- [ ] User can connect MetaMask wallet
- [ ] Connected address displays correctly
- [ ] Balance updates after transactions
- [ ] Network mismatch warning displays

### AC2: Listing Creation

- [ ] User can upload image and see preview
- [ ] Listing creates successfully on-chain
- [ ] Listing appears in explore page
- [ ] Metadata retrievable from IPFS

### AC3: Purchase Flow

- [ ] Buyer can initiate escrow purchase
- [ ] Funds transfer to contract
- [ ] Buyer can confirm delivery
- [ ] Seller receives funds minus fee

### AC4: Auction Flow

- [ ] Bid places successfully
- [ ] Outbid user can withdraw funds
- [ ] Auction ends correctly after duration
- [ ] Winner's payment transfers to seller

---

## 8. Related Documentation

- [System Architecture](02-system-architecture.md)
- [Data & Storage](03-data-and-storage.md)
- [Sequence Flows](05-sequence-flows.md)

# System Architecture

## Purpose

Provide a detailed narrative of the system architecture, including comparisons to traditional web applications.

## Scope

Covers component interactions, trust model, and architectural decisions.

## Audience

Developers, system architects, and academic reviewers.

---

## 1. Architecture Overview

DecentraMarket is a **three-tier decentralised application (dApp)**:

1. **Presentation Tier**: Next.js web application (client-rendered React)
2. **Logic Tier**: Ethereum smart contract (on-chain business logic)
3. **Data Tier**: Split between Ethereum blockchain (state) and IPFS (content)

### Component Interaction Flow

```
User Browser
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Frontend                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   React UI  │◄─│ ethers.js   │──│ WalletContext       │ │
│  │   (Pages)   │  │ (RPC calls) │  │ (MetaMask state)    │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│         │  ┌─────────────┴─────────────────────┘            │
│         │  │                                                │
│         ▼  ▼                                                │
│  ┌───────────────────┐     ┌────────────────────────────┐  │
│  │  /api/ipfs/upload │────►│ Pinata REST API (Server)   │  │
│  │  (API Route)      │     │ (JWT authentication)       │  │
│  └───────────────────┘     └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
     │                              │
     │ JSON-RPC                     │ HTTPS
     ▼                              ▼
┌─────────────────────┐     ┌────────────────────────────────┐
│  MetaMask Wallet    │     │         IPFS Network           │
│  (Signs tx, sends)  │     │  (Pinata node + gateways)      │
└──────────┬──────────┘     └────────────────────────────────┘
           │
           │ Signed Transaction
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Ethereum Network                         │
│                    (Sepolia Testnet)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Marketplace Smart Contract              │   │
│  │  ┌────────────────┐  ┌────────────────────────────┐ │   │
│  │  │ State Storage  │  │    Event Logs              │ │   │
│  │  │ - _listings    │  │ - ListingCreated           │ │   │
│  │  │ - _userListings│  │ - ItemPurchased            │ │   │
│  │  │ - _pendingReturns  - BidPlaced                 │ │   │
│  │  └────────────────┘  └────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Traditional Web App vs dApp Architecture

### Traditional Architecture (Centralised)

```
┌─────────────┐     HTTPS      ┌─────────────┐     SQL      ┌─────────────┐
│   Browser   │◄──────────────►│   Server    │◄────────────►│  Database   │
│  (Frontend) │                │  (Backend)  │              │  (Central)  │
└─────────────┘                └─────────────┘              └─────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │  Auth DB    │
                              │ (Passwords) │
                              └─────────────┘

Characteristics:
- Server controls all business logic
- Server authenticates users (username/password)
- Database stores all state (mutable)
- Server can modify any data
- Single point of failure
- Users trust the platform operator
```

### dApp Architecture (Decentralised)

```
┌─────────────┐     RPC        ┌─────────────┐   Consensus   ┌─────────────┐
│   Browser   │◄──────────────►│  Ethereum   │◄─────────────►│   Other     │
│  (Frontend) │                │    Node     │               │   Nodes     │
└──────┬──────┘                └─────────────┘               └─────────────┘
       │
       │ Signs tx
       ▼
┌─────────────┐                ┌─────────────────────────────────────────┐
│  MetaMask   │                │              Blockchain                 │
│  (Wallet)   │───────────────►│  ┌─────────────────────────────────┐   │
└─────────────┘   Signed tx    │  │     Smart Contract State        │   │
                               │  │  (Immutable once confirmed)     │   │
                               │  └─────────────────────────────────┘   │
                               └─────────────────────────────────────────┘

Characteristics:
- Smart contract executes business logic (deterministic)
- Wallet authenticates users (cryptographic signatures)
- Blockchain stores state (immutable, replicated)
- No single party can modify data unilaterally
- No single point of failure (thousands of nodes)
- Users verify, don't trust ("don't trust, verify")
```

### Key Differences

| Aspect | Traditional Web App | dApp |
|--------|---------------------|------|
| **Authentication** | Username/password stored centrally | Cryptographic wallet signatures |
| **Authorisation** | Server checks permissions | Smart contract enforces rules |
| **State Storage** | Central database (MySQL, PostgreSQL) | Blockchain (replicated globally) |
| **Data Mutability** | Admin can edit/delete any record | Data immutable once confirmed |
| **Downtime** | Server outage = app unavailable | Contract always available |
| **Trust Model** | Trust the platform operator | Trust the code (verifiable) |
| **Costs** | Server hosting (operator pays) | Gas fees (user pays per tx) |
| **Privacy** | Server sees all activity | Pseudonymous (address, not identity) |

---

## 3. Trust Model

### Levels of Trust in DecentraMarket

```
                    ┌───────────────────────────────────────┐
                    │           TRUSTLESS LAYER             │
                    │  ┌─────────────────────────────────┐  │
                    │  │    Ethereum Consensus           │  │
                    │  │    - Thousands of validators    │  │
                    │  │    - Cryptographic proofs       │  │
                    │  │    - Economic incentives        │  │
                    │  └─────────────────────────────────┘  │
                    │                                       │
                    │  ┌─────────────────────────────────┐  │
                    │  │    Smart Contract Code          │  │
                    │  │    - Verified on Etherscan      │  │
                    │  │    - Deterministic execution    │  │
                    │  │    - Cannot be modified         │  │
                    │  └─────────────────────────────────┘  │
                    └───────────────────────────────────────┘
                                       │
                    ───────────────────┼───────────────────
                                       │
                    ┌───────────────────────────────────────┐
                    │          TRUST-MINIMISED LAYER        │
                    │  ┌─────────────────────────────────┐  │
                    │  │    IPFS Content Addressing      │  │
                    │  │    - CID = hash of content      │  │
                    │  │    - Tamper-evident             │  │
                    │  │    - Depends on pinning service │  │
                    │  └─────────────────────────────────┘  │
                    │                                       │
                    │  ┌─────────────────────────────────┐  │
                    │  │    MetaMask Wallet              │  │
                    │  │    - User controls keys         │  │
                    │  │    - Trusted to sign correctly  │  │
                    │  └─────────────────────────────────┘  │
                    └───────────────────────────────────────┘
                                       │
                    ───────────────────┼───────────────────
                                       │
                    ┌───────────────────────────────────────┐
                    │           TRUSTED LAYER               │
                    │  ┌─────────────────────────────────┐  │
                    │  │    Frontend Application         │  │
                    │  │    - Could display false data   │  │
                    │  │    - Users can verify on-chain  │  │
                    │  └─────────────────────────────────┘  │
                    │                                       │
                    │  ┌─────────────────────────────────┐  │
                    │  │    RPC Provider                 │  │
                    │  │    - Could return stale data    │  │
                    │  │    - Replaceable by user        │  │
                    │  └─────────────────────────────────┘  │
                    └───────────────────────────────────────┘
```

### Trust Boundaries Explained

1. **Trustless (Don't trust, verify)**:
   - Ethereum consensus ensures no single party controls state
   - Smart contract code is public and immutable
   - Anyone can verify transaction correctness

2. **Trust-Minimised**:
   - IPFS uses content addressing (CID = hash), but content could disappear
   - MetaMask is trusted software but open-source and audited

3. **Trusted (Convenience, replaceable)**:
   - Frontend could lie about prices, but actual tx uses on-chain data
   - User can always interact with contract directly via Etherscan

---

## 4. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CREATE LISTING FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

User                Frontend              API Route           IPFS           Contract
 │                    │                      │                 │                │
 │  1. Fill form      │                      │                 │                │
 │───────────────────►│                      │                 │                │
 │                    │  2. Upload image     │                 │                │
 │                    │─────────────────────►│                 │                │
 │                    │                      │  3. Pin to IPFS │                │
 │                    │                      │────────────────►│                │
 │                    │                      │◄────────────────│                │
 │                    │                      │  4. Return CID  │                │
 │                    │◄─────────────────────│                 │                │
 │                    │  5. CID (image)      │                 │                │
 │                    │                      │                 │                │
 │                    │  6. Upload metadata  │                 │                │
 │                    │─────────────────────►│                 │                │
 │                    │                      │  7. Pin JSON    │                │
 │                    │                      │────────────────►│                │
 │                    │                      │◄────────────────│                │
 │                    │                      │  8. Return CID  │                │
 │                    │◄─────────────────────│                 │                │
 │                    │  9. CID (metadata)   │                 │                │
 │                    │                      │                 │                │
 │                    │  10. createListing(uri, price, ...)   │                │
 │                    │────────────────────────────────────────────────────────►│
 │                    │                      │                 │                │
 │                    │  11. Sign transaction                 │                │
 │◄───────────────────│  (MetaMask popup)    │                 │                │
 │                    │                      │                 │                │
 │  12. Confirm       │                      │                 │                │
 │───────────────────►│                      │                 │                │
 │                    │                      │                 │                │
 │                    │  13. Broadcast tx    │                 │                │
 │                    │────────────────────────────────────────────────────────►│
 │                    │                      │                 │                │
 │                    │  14. Tx receipt      │                 │  15. State    │
 │                    │◄────────────────────────────────────────────────────────│
 │                    │                      │                 │    updated    │
 │  16. Success!      │                      │                 │                │
 │◄───────────────────│                      │                 │                │
```

---

## 5. Component Responsibilities

### Frontend (Next.js)

| Component | Responsibility |
|-----------|---------------|
| `WalletContext` | Manage MetaMask connection state |
| `useMarketplace` | Wrap contract calls, parse results |
| Pages | Render UI, handle user interactions |
| API Routes | Server-side IPFS uploads (secure) |

### Smart Contract (Marketplace.sol)

| Function | Responsibility |
|----------|---------------|
| `createListing` | Store new listing state, emit event |
| `initiatePurchase` | Hold funds in escrow, record buyer |
| `confirmDelivery` | Transfer funds to seller |
| `placeBid` | Update highest bid, track pending returns |
| `endAuction` | Finalise auction, transfer funds |

### IPFS (via Pinata)

| Operation | Purpose |
|-----------|---------|
| Pin image | Store listing image content |
| Pin metadata | Store JSON with name, description, image CID |
| Gateway retrieval | Serve content via HTTP for display |

---

## 6. Related Documentation

- [Data & Storage](03-data-and-storage.md) — Detailed data models
- [API & Contracts](04-api-and-contracts.md) — Function specifications
- [Sequence Flows](05-sequence-flows.md) — Detailed sequence diagrams

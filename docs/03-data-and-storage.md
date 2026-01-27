# Data and Storage

## Purpose

Document the data models used across on-chain, off-chain, and client state layers.

## Scope

Covers smart contract state, IPFS metadata schema, and client-side data handling.

## Audience

Developers working with the data layer.

---

## 1. Storage Architecture

DecentraMarket uses a **hybrid storage model**:

| Storage Type | Technology | What's Stored | Characteristics |
|--------------|------------|---------------|-----------------|
| **On-chain** | Ethereum | Listings, balances, state | Immutable, expensive, globally consistent |
| **Off-chain** | IPFS | Images, metadata JSON | Content-addressed, cheap, eventually available |
| **Client** | React state | UI state, cached data | Ephemeral, fast, local only |

### Why Hybrid?

```
Cost comparison for storing 1MB of data:

On-chain (Ethereum):     ~$20,000 USD (at 50 gwei, 32KB storage)
IPFS (Pinata):           ~$0.0001 USD (per month pinning)

→ Store minimal references on-chain, bulk content on IPFS
```

---

## 2. On-Chain Data Model

### Listing Struct

```solidity
struct Listing {
    uint256 id;              // Unique identifier (0-indexed)
    address seller;          // Seller's Ethereum address
    string metadataURI;      // IPFS URI (ipfs://Qm... or ipfs://baf...)
    uint256 price;           // Price in wei (or starting price for auctions)
    ListingType listingType; // 0 = FixedPrice, 1 = Auction
    ListingStatus status;    // 0 = Active, 1 = Sold, 2 = Cancelled, 3 = InEscrow
    uint256 createdAt;       // Block timestamp of creation
    uint256 endTime;         // Auction end time (0 for fixed-price)
    address highestBidder;   // Current highest bidder (auctions)
    uint256 highestBid;      // Current highest bid in wei (auctions)
    address buyer;           // Buyer address (escrow purchases)
    uint256 escrowDeadline;  // Deadline for delivery confirmation
}
```

### Enums

```solidity
enum ListingStatus {
    Active,     // 0 - Available for purchase/bidding
    Sold,       // 1 - Transaction completed
    Cancelled,  // 2 - Seller cancelled
    InEscrow    // 3 - Funds held, awaiting delivery confirmation
}

enum ListingType {
    FixedPrice, // 0 - Instant purchase at set price
    Auction     // 1 - Time-limited bidding
}
```

### Storage Mappings

```solidity
// Primary listing storage
mapping(uint256 => Listing) private _listings;

// User's listing IDs (for profile page)
mapping(address => uint256[]) private _userListings;

// Pending returns for outbid users (pull pattern)
mapping(uint256 => mapping(address => uint256)) private _pendingReturns;

// Active listings array (for explore page)
uint256[] private _activeListingIds;
mapping(uint256 => uint256) private _activeListingIndex;
```

### State Variables

```solidity
uint256 private _listingIdCounter;                    // Auto-incrementing ID
uint256 public platformFee;                           // Fee in basis points (250 = 2.5%)
uint256 public constant MAX_PLATFORM_FEE = 1000;      // 10% maximum
uint256 public constant MIN_AUCTION_DURATION = 1 hours;
uint256 public constant MAX_AUCTION_DURATION = 30 days;
uint256 public constant MIN_BID_INCREMENT_PERCENT = 5; // 5% minimum raise
uint256 public constant ESCROW_PERIOD = 14 days;       // Buyer protection period
```

---

## 3. Off-Chain Data Model (IPFS)

### Metadata JSON Schema

```json
{
  "name": "Vintage Camera",
  "description": "A classic 35mm film camera in excellent condition...",
  "image": "ipfs://bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku",
  "category": "electronics",
  "attributes": [
    {
      "trait_type": "Condition",
      "value": "Excellent"
    },
    {
      "trait_type": "Brand",
      "value": "Canon"
    }
  ],
  "createdAt": "2026-01-27T10:30:00.000Z"
}
```

### TypeScript Interface

```typescript
export interface ItemMetadata {
  name: string;           // Item title
  description: string;    // Detailed description
  image: string;          // IPFS URI (ipfs://CID)
  category?: string;      // Optional category
  attributes?: {          // Optional key-value attributes
    trait_type: string;
    value: string;
  }[];
  createdAt: string;      // ISO 8601 timestamp
}
```

### CID Formats

| Format | Example | Used By |
|--------|---------|---------|
| CIDv0 | `QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB` | Legacy IPFS |
| CIDv1 | `bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku` | Modern (Pinata default) |

### Validation Function

```typescript
export function isValidCID(cid: string): boolean {
  if (!cid || cid.length < 20) return false;
  
  // CIDv0: starts with "Qm", 46 characters
  if (cid.startsWith("Qm") && cid.length === 46) return true;
  
  // CIDv1: starts with "baf" prefix
  if (cid.startsWith("baf") || cid.startsWith("bafy") || cid.startsWith("bafk")) return true;
  
  return false;
}
```

---

## 4. Content Addressing Explained

### How IPFS Works

```
                    ┌────────────────────────────────────┐
                    │           Original Content         │
                    │  { "name": "Camera", ... }         │
                    └──────────────┬─────────────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────────────┐
                    │         Hash Function              │
                    │      SHA-256 + Multihash           │
                    └──────────────┬─────────────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────────────┐
                    │         Content Identifier         │
                    │  bafkrei...xyz (CIDv1)             │
                    └────────────────────────────────────┘

Key Properties:
1. Same content → Same CID (deterministic)
2. Any change → Completely different CID
3. CID = cryptographic proof of content
```

### Why Content Addressing Matters

| Traditional URL | Content-Addressed |
|-----------------|-------------------|
| `https://example.com/image.jpg` | `ipfs://bafkrei...` |
| Content can change | Content is immutable |
| Server can go down | Content survives on any node |
| Must trust server | Verify content matches hash |

---

## 5. Client-Side Data

### WalletContext State

```typescript
interface WalletContextType {
  address: string | null;           // Connected wallet address
  isConnected: boolean;             // Connection status
  isConnecting: boolean;            // Loading state
  chainId: number | null;           // Current network (31337, 11155111)
  balance: string;                  // ETH balance (formatted)
  provider: BrowserProvider | null; // ethers.js provider
  signer: JsonRpcSigner | null;     // For signing transactions
  marketplace: Contract | null;     // Contract instance
  error: string | null;             // Connection error
}
```

### Listing State (Frontend)

```typescript
// Raw listing from contract
export interface Listing {
  id: bigint;
  seller: string;
  metadataURI: string;
  price: bigint;
  listingType: ListingType;
  status: ListingStatus;
  createdAt: bigint;
  endTime: bigint;
  highestBidder: string;
  highestBid: bigint;
  buyer: string;
  escrowDeadline: bigint;
}

// Listing with fetched metadata
export interface ListingWithMetadata extends Listing {
  metadata: ItemMetadata | null;
}
```

---

## 6. Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────────┘

CREATION:
  User fills form
       │
       ▼
  Image → IPFS → CID₁ (bafkrei...)
       │
       ▼
  Metadata { name, desc, image: CID₁ } → IPFS → CID₂
       │
       ▼
  createListing(ipfs://CID₂, price, ...) → Ethereum → listingId
       │
       ▼
  Listing struct stored on-chain with metadataURI = "ipfs://CID₂"


RETRIEVAL:
  getActiveListings() → [0, 1, 2, ...]
       │
       ▼
  getListing(0) → Listing { metadataURI: "ipfs://CID₂", ... }
       │
       ▼
  fetchMetadataFromIPFS("ipfs://CID₂") → { name, image: "ipfs://CID₁" }
       │
       ▼
  ipfsToHttpUrls("ipfs://CID₁") → ["https://ipfs.io/ipfs/CID₁", ...]
       │
       ▼
  <img src="https://ipfs.io/ipfs/CID₁" />
```

---

## 7. Related Documentation

- [System Architecture](02-system-architecture.md) — High-level overview
- [API & Contracts](04-api-and-contracts.md) — Contract functions
- [Glossary](08-glossary.md) — Term definitions

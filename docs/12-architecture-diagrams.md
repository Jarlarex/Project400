# Architecture Diagrams

Mermaid diagrams for DecentraMarket architecture.

---

## 1. System Architecture Overview

```mermaid
flowchart TB
    subgraph User["👤 User"]
        Browser["Browser"]
        MetaMask["MetaMask Wallet"]
    end

    subgraph Frontend["Frontend Layer"]
        NextJS["Next.js 14 App"]
        WalletCtx["Wallet Context"]
        MarketHook["useMarketplace Hook"]
        IPFSLib["IPFS Utilities"]
    end

    subgraph Storage["Decentralised Storage"]
        Pinata["Pinata API"]
        IPFS["IPFS Network"]
    end

    subgraph Blockchain["Ethereum (Sepolia)"]
        RPC["RPC Provider<br/>(Alchemy/Infura)"]
        Contract["Marketplace.sol"]
        
        subgraph ContractData["On-Chain Data"]
            Listings["Listings[]"]
            Escrow["Escrow State"]
            Auctions["Auction Bids"]
            Fees["Platform Fees"]
        end
    end

    Browser --> NextJS
    Browser <--> MetaMask
    
    NextJS --> WalletCtx
    NextJS --> MarketHook
    NextJS --> IPFSLib
    
    WalletCtx <--> MetaMask
    MarketHook <--> MetaMask
    
    IPFSLib --> Pinata
    Pinata --> IPFS
    
    MetaMask <--> RPC
    RPC <--> Contract
    Contract --> ContractData
```

---

## 2. Data Flow Diagram

```mermaid
flowchart LR
    subgraph OffChain["Off-Chain (IPFS)"]
        Image["Item Image"]
        Meta["Metadata JSON<br/>{name, description, image}"]
    end

    subgraph OnChain["On-Chain (Ethereum)"]
        Listing["Listing Struct<br/>• id<br/>• seller<br/>• metadataURI<br/>• price<br/>• status<br/>• buyer<br/>• escrowDeadline"]
    end

    subgraph Frontend["Frontend"]
        UI["User Interface"]
    end

    Image -->|"Upload"| Meta
    Meta -->|"Pin to IPFS"| CID["CID<br/>bafkrei..."]
    CID -->|"ipfs://CID"| Listing
    
    Listing -->|"Read metadataURI"| UI
    UI -->|"Fetch via Gateway"| Meta
    Meta -->|"Display"| UI
```

---

## 3. Create Listing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant P as Pinata/IPFS
    participant M as MetaMask
    participant C as Contract

    U->>F: Fill form (name, price, image)
    F->>P: Upload image
    P-->>F: Image CID
    
    F->>P: Upload metadata JSON
    P-->>F: Metadata CID
    
    F->>M: Request transaction signature
    M->>U: Confirm transaction?
    U->>M: Approve
    
    M->>C: createListing(metadataURI, price, type, duration)
    C-->>C: Emit ListingCreated event
    C-->>M: Transaction receipt
    M-->>F: Success
    F-->>U: Listing created!
```

---

## 4. Purchase with Escrow Flow

```mermaid
sequenceDiagram
    participant B as Buyer
    participant S as Seller
    participant F as Frontend
    participant M as MetaMask
    participant C as Contract

    Note over B,C: Phase 1: Initiate Purchase
    B->>F: Click "Buy Now"
    F->>M: Request signature + ETH
    M->>B: Confirm payment?
    B->>M: Approve
    M->>C: initiatePurchase{value: price}
    C-->>C: Hold ETH in escrow
    C-->>C: Set status = InEscrow
    C-->>C: Set deadline = now + 14 days
    C-->>M: Success
    
    Note over B,S: Phase 2: Off-chain delivery
    S->>S: Ships item
    B->>B: Receives item
    
    Note over B,C: Phase 3a: Buyer confirms
    B->>F: Click "Confirm Delivery"
    F->>M: Request signature
    M->>C: confirmDelivery(listingId)
    C-->>C: Transfer ETH to seller (minus fee)
    C-->>C: Set status = Sold
    
    Note over S,C: Phase 3b: OR Seller releases after deadline
    S->>F: Click "Release Escrow" (after 14 days)
    F->>M: Request signature
    M->>C: releaseEscrow(listingId)
    C-->>C: Check deadline passed
    C-->>C: Transfer ETH to seller
```

---

## 5. Auction Flow

```mermaid
sequenceDiagram
    participant S as Seller
    participant B1 as Bidder 1
    participant B2 as Bidder 2
    participant C as Contract

    S->>C: createListing(type=Auction, duration=24h)
    C-->>C: Set endTime = now + 24h
    
    Note over B1,C: Bidding Phase
    B1->>C: placeBid{value: 1 ETH}
    C-->>C: Record bid, highestBidder = B1
    
    B2->>C: placeBid{value: 1.5 ETH}
    C-->>C: Record bid, highestBidder = B2
    C-->>C: B1's 1 ETH available to withdraw
    
    B1->>C: withdrawBid()
    C-->>B1: Return 1 ETH
    
    Note over S,C: After endTime
    S->>C: endAuction(listingId)
    C-->>C: Check: block.timestamp > endTime
    C-->>C: Transfer 1.5 ETH to seller (minus fee)
    C-->>C: Set status = Sold
```

---

## 6. Component Architecture

```mermaid
flowchart TB
    subgraph Pages["Pages (App Router)"]
        Home["/ (Home)"]
        Explore["/explore"]
        Create["/create"]
        Listing["/listing/[id]"]
        Profile["/profile"]
    end

    subgraph Components["Components"]
        Header["Header"]
        Footer["Footer"]
        ListingCard["ListingCard"]
        IpfsImage["IpfsImage"]
    end

    subgraph Contexts["Contexts"]
        WalletContext["WalletContext<br/>• address<br/>• isConnected<br/>• connect()"]
    end

    subgraph Hooks["Hooks"]
        useMarketplace["useMarketplace<br/>• marketplace contract<br/>• createListing()<br/>• initiatePurchase()<br/>• confirmDelivery()"]
    end

    subgraph Lib["Lib/Utils"]
        constants["constants.ts<br/>• CONTRACT_ADDRESS<br/>• CHAIN_ID"]
        ipfs["ipfs.ts<br/>• uploadFile()<br/>• fetchMetadata()"]
        contractABI["Marketplace.json"]
    end

    Pages --> Components
    Pages --> Contexts
    Pages --> Hooks
    
    Hooks --> Lib
    Components --> Lib
```

---

## 7. Smart Contract Structure

```mermaid
classDiagram
    class Marketplace {
        +address owner
        +uint256 platformFee
        +uint256 listingCount
        +mapping listings
        +mapping userListings
        +createListing()
        +initiatePurchase()
        +confirmDelivery()
        +releaseEscrow()
        +placeBid()
        +endAuction()
        +withdrawBid()
        +cancelListing()
        +updatePlatformFee()
        +withdrawFees()
    }

    class Listing {
        +uint256 id
        +address seller
        +string metadataURI
        +uint256 price
        +ListingType listingType
        +ListingStatus status
        +uint256 endTime
        +uint256 highestBid
        +address highestBidder
        +address buyer
        +uint256 escrowDeadline
    }

    class ListingStatus {
        <<enumeration>>
        Active
        InEscrow
        Sold
        Cancelled
    }

    class ListingType {
        <<enumeration>>
        FixedPrice
        Auction
    }

    Marketplace "1" --> "*" Listing : contains
    Listing --> ListingStatus
    Listing --> ListingType
    
    class Ownable {
        +address owner
        +onlyOwner()
    }
    
    class ReentrancyGuard {
        +nonReentrant()
    }
    
    Marketplace --|> Ownable : inherits
    Marketplace --|> ReentrancyGuard : inherits
```

---

## 8. Trust Model Comparison

```mermaid
flowchart LR
    subgraph Traditional["Traditional Marketplace"]
        TBuyer["Buyer"] -->|"Pays"| TPlatform["Platform<br/>(eBay, Amazon)"]
        TPlatform -->|"Holds funds"| TPlatform
        TPlatform -->|"Releases"| TSeller["Seller"]
        
        TRisk["⚠️ Risk: Platform controls funds"]
    end

    subgraph Decentralised["DecentraMarket"]
        DBuyer["Buyer"] -->|"Pays"| DContract["Smart Contract<br/>(Code)"]
        DContract -->|"Holds in escrow"| DContract
        DContract -->|"Auto-releases"| DSeller["Seller"]
        
        DSafe["✅ Safe: Code controls funds"]
    end
```

---

## 9. Deployment Architecture

```mermaid
flowchart TB
    subgraph Development["Development"]
        LocalNode["Hardhat Node<br/>localhost:8545"]
        HardhatDeploy["Deploy Script"]
    end

    subgraph Testing["Testing"]
        Sepolia["Sepolia Testnet"]
        SepoliaRPC["Alchemy RPC"]
        Etherscan["Etherscan<br/>(Verified)"]
    end

    subgraph Production["Production (Future)"]
        Mainnet["Ethereum Mainnet"]
        L2["Layer 2<br/>(Polygon/Arbitrum)"]
    end

    subgraph Frontend_Deploy["Frontend"]
        Vercel["Vercel / Netlify"]
    end

    HardhatDeploy -->|"npm run deploy:local"| LocalNode
    HardhatDeploy -->|"npm run deploy:sepolia"| Sepolia
    Sepolia --> SepoliaRPC
    Sepolia --> Etherscan
    
    HardhatDeploy -.->|"Future"| Mainnet
    HardhatDeploy -.->|"Future"| L2
    
    Vercel --> SepoliaRPC
```

---

## Usage

### In Markdown (GitHub)
GitHub renders Mermaid natively. Just paste the code blocks.

### In PowerPoint
1. Go to [mermaid.live](https://mermaid.live)
2. Paste diagram code
3. Export as PNG/SVG
4. Insert into slide

### In Notion
Notion supports Mermaid in code blocks with `mermaid` language tag.

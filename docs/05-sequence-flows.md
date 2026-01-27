# Sequence Flows

## Purpose

Visualise the key user journeys with sequence diagrams.

## Scope

Covers wallet connection, listing creation, purchases, and auctions.

## Audience

Developers and anyone seeking to understand system interactions.

---

## 1. Wallet Connect / Authentication

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Frontend
    participant MetaMask
    participant Ethereum

    User->>Browser: Opens dApp
    Browser->>Frontend: Load page
    Frontend->>Frontend: Check window.ethereum
    
    alt MetaMask not installed
        Frontend->>User: "Please install MetaMask"
    else MetaMask installed
        Frontend->>MetaMask: eth_accounts (check existing)
        
        alt Already connected
            MetaMask-->>Frontend: [address]
            Frontend->>Ethereum: getBalance(address)
            Ethereum-->>Frontend: balance
            Frontend->>User: Show connected state
        else Not connected
            User->>Frontend: Click "Connect Wallet"
            Frontend->>MetaMask: eth_requestAccounts
            MetaMask->>User: Connection popup
            
            alt User approves
                User->>MetaMask: Approve
                MetaMask-->>Frontend: [address]
                Frontend->>Ethereum: getBalance(address)
                Ethereum-->>Frontend: balance
                Frontend->>Frontend: Initialize contract instance
                Frontend->>User: Show connected state
            else User rejects
                User->>MetaMask: Reject
                MetaMask-->>Frontend: Error (4001)
                Frontend->>User: "Connection rejected"
            end
        end
    end
```

---

## 2. Create Listing

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Pinata
    participant IPFS
    participant MetaMask
    participant Contract

    User->>Frontend: Fill form (name, desc, image, price)
    User->>Frontend: Click "Create Listing"
    
    Frontend->>Frontend: Validate inputs
    
    Note over Frontend,Pinata: Image Upload
    Frontend->>API: POST /api/ipfs/upload (file)
    API->>Pinata: pinFileToIPFS
    Pinata->>IPFS: Pin content
    IPFS-->>Pinata: CID (image)
    Pinata-->>API: { IpfsHash: CID }
    API-->>Frontend: { cid: imageCID }
    
    Note over Frontend,Pinata: Metadata Upload
    Frontend->>Frontend: Build metadata JSON
    Frontend->>API: POST /api/ipfs/upload (json)
    API->>Pinata: pinJSONToIPFS
    Pinata->>IPFS: Pin content
    IPFS-->>Pinata: CID (metadata)
    Pinata-->>API: { IpfsHash: CID }
    API-->>Frontend: { cid: metadataCID }
    
    Note over Frontend,Contract: Blockchain Transaction
    Frontend->>MetaMask: createListing(uri, price, isAuction, duration)
    MetaMask->>User: Sign transaction popup
    User->>MetaMask: Confirm
    MetaMask->>Contract: Send transaction
    Contract->>Contract: Validate & store listing
    Contract-->>MetaMask: Transaction receipt
    MetaMask-->>Frontend: Receipt with logs
    
    Frontend->>Frontend: Parse ListingCreated event
    Frontend->>User: Redirect to /listing/{id}
```

---

## 3. Fetch Listings (Explore Page)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Contract
    participant IPFS Gateway

    User->>Frontend: Navigate to /explore
    Frontend->>Frontend: Check marketplace contract exists
    
    alt Wallet connected
        Frontend->>Contract: getActiveListings()
        Contract-->>Frontend: [0, 1, 2, ...]
        
        loop For each listingId
            Frontend->>Contract: getListing(id)
            Contract-->>Frontend: Listing struct
            
            Frontend->>Frontend: Validate CID format
            
            alt Valid CID
                Frontend->>IPFS Gateway: GET /ipfs/{CID}
                
                alt Gateway 1 succeeds
                    IPFS Gateway-->>Frontend: Metadata JSON
                else Gateway 1 fails
                    Frontend->>IPFS Gateway: Try Gateway 2
                    IPFS Gateway-->>Frontend: Metadata JSON
                end
                
                Frontend->>Frontend: Merge listing + metadata
            else Invalid CID
                Frontend->>Frontend: Skip listing
            end
        end
        
        Frontend->>User: Render listing grid
    else Wallet not connected
        Frontend->>User: Show empty state
    end
```

---

## 4. Purchase with Escrow

```mermaid
sequenceDiagram
    participant Buyer
    participant Frontend
    participant MetaMask
    participant Contract
    participant Seller

    Buyer->>Frontend: View listing detail
    Frontend->>Contract: getListing(id)
    Contract-->>Frontend: Listing (status: Active)
    
    Buyer->>Frontend: Click "Buy Now"
    Frontend->>MetaMask: initiatePurchase(id) + value
    MetaMask->>Buyer: Sign transaction (amount shown)
    Buyer->>MetaMask: Confirm
    
    MetaMask->>Contract: initiatePurchase{value: price}
    
    Contract->>Contract: Verify: Active, FixedPrice, not seller
    Contract->>Contract: status = InEscrow
    Contract->>Contract: buyer = msg.sender
    Contract->>Contract: escrowDeadline = now + 14 days
    Contract->>Contract: Hold funds in contract
    
    Contract-->>MetaMask: Receipt
    MetaMask-->>Frontend: Success
    
    Frontend->>Buyer: "Purchase initiated! Item in escrow"
    
    Note over Seller: Seller sees notification
    Seller->>Frontend: View profile
    Frontend->>Seller: "Action Required - Items In Escrow"
    
    Note over Seller: Ships item off-chain
    
    Note over Buyer: Receives item
    Buyer->>Frontend: Click "Confirm Delivery"
    Frontend->>MetaMask: confirmDelivery(id)
    MetaMask->>Buyer: Sign transaction
    Buyer->>MetaMask: Confirm
    
    MetaMask->>Contract: confirmDelivery(id)
    Contract->>Contract: Verify: InEscrow, msg.sender == buyer
    Contract->>Contract: status = Sold
    Contract->>Contract: Calculate fee (2.5%)
    Contract->>Seller: Transfer (price - fee)
    
    Contract-->>MetaMask: Receipt
    Frontend->>Buyer: "Delivery confirmed!"
```

---

## 5. Escrow Release After Deadline

```mermaid
sequenceDiagram
    participant Seller
    participant Frontend
    participant MetaMask
    participant Contract

    Note over Seller: 14 days pass, buyer hasn't confirmed
    
    Seller->>Frontend: View listing in profile
    Frontend->>Contract: getListing(id)
    Contract-->>Frontend: Listing (InEscrow, deadline passed)
    
    Frontend->>Frontend: Check: now >= escrowDeadline
    Frontend->>Seller: Show "Release Escrow" button
    
    Seller->>Frontend: Click "Release Escrow"
    Frontend->>MetaMask: releaseEscrow(id)
    MetaMask->>Seller: Sign transaction
    Seller->>MetaMask: Confirm
    
    MetaMask->>Contract: releaseEscrow(id)
    Contract->>Contract: Verify: InEscrow, seller, deadline passed
    Contract->>Contract: status = Sold
    Contract->>Contract: Calculate fee
    Contract->>Seller: Transfer (price - fee)
    
    Contract-->>MetaMask: Receipt
    Frontend->>Seller: "Funds released!"
```

---

## 6. Auction Lifecycle

```mermaid
sequenceDiagram
    participant Seller
    participant Bidder1
    participant Bidder2
    participant Frontend
    participant Contract

    Note over Seller: Create Auction
    Seller->>Frontend: Create listing (auction, 1 day)
    Frontend->>Contract: createListing(..., true, 86400)
    Contract-->>Frontend: listingId = 0
    
    Note over Bidder1: First Bid
    Bidder1->>Frontend: View auction
    Frontend->>Bidder1: Starting price: 1 ETH
    Bidder1->>Contract: placeBid(0) + 1 ETH
    Contract->>Contract: highestBidder = Bidder1
    Contract->>Contract: highestBid = 1 ETH
    
    Note over Bidder2: Outbid
    Bidder2->>Frontend: View auction
    Frontend->>Bidder2: Min bid: 1.05 ETH (5% increment)
    Bidder2->>Contract: placeBid(0) + 1.1 ETH
    Contract->>Contract: pendingReturns[0][Bidder1] += 1 ETH
    Contract->>Contract: highestBidder = Bidder2
    Contract->>Contract: highestBid = 1.1 ETH
    
    Note over Bidder1: Withdraw outbid funds
    Bidder1->>Contract: withdrawBid(0)
    Contract->>Bidder1: Transfer 1 ETH
    
    Note over Contract: Auction ends (time passes)
    
    Note over Seller: End Auction
    Seller->>Contract: endAuction(0)
    Contract->>Contract: Verify: time >= endTime
    Contract->>Contract: status = Sold
    Contract->>Contract: Calculate fee
    Contract->>Seller: Transfer (1.1 ETH - fee)
    Contract-->>Seller: AuctionEnded event
```

---

## 7. ASCII Diagrams (Alternative)

### Purchase Flow (ASCII)

```
Buyer          Frontend         MetaMask         Contract         Seller
  |               |                |                |                |
  | Click Buy     |                |                |                |
  |-------------->|                |                |                |
  |               | initiatePurchase               |                |
  |               |--------------->|                |                |
  |               |                | Sign request   |                |
  |               |<---------------|                |                |
  | Confirm       |                |                |                |
  |-------------->|                |                |                |
  |               |                | Send tx        |                |
  |               |                |--------------->|                |
  |               |                |                | Validate       |
  |               |                |                | Hold funds     |
  |               |                |                | status=InEscrow|
  |               |                |<---------------| Receipt        |
  |               |<---------------|                |                |
  | Success!      |                |                |                |
  |<--------------|                |                |                |
  |               |                |                |                |
  |               |                |                | Notification   |
  |               |                |                |--------------->|
  |               |                |                | "Ship item!"   |
```

---

## 8. Related Documentation

- [Requirements](01-requirements.md) — Functional requirements
- [System Architecture](02-system-architecture.md) — Component overview
- [API & Contracts](04-api-and-contracts.md) — Function details

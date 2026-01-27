# API and Smart Contract Reference

## Purpose

Document all smart contract functions, events, and API endpoints with their parameters and behaviours.

## Scope

Covers Marketplace.sol functions, events, and the IPFS upload API route.

## Audience

Developers integrating with the contract or API.

---

## 1. Smart Contract: Marketplace.sol

**Address (Sepolia)**: `0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b`

**Compiler**: Solidity 0.8.24

**Inheritance**: `ReentrancyGuard`, `Ownable` (OpenZeppelin v5)

---

## 2. Write Functions

### createListing

Create a new fixed-price or auction listing.

```solidity
function createListing(
    string memory metadataURI,
    uint256 price,
    bool isAuction,
    uint256 duration
) external returns (uint256)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `metadataURI` | string | IPFS URI (e.g., `ipfs://bafkrei...`) |
| `price` | uint256 | Price in wei (fixed) or starting price (auction) |
| `isAuction` | bool | `true` for auction, `false` for fixed price |
| `duration` | uint256 | Auction duration in seconds (ignored for fixed price) |

**Returns**: `listingId` (uint256)

**Reverts**:
- `"Empty metadata URI"` — metadataURI is empty string
- `"Price must be greater than 0"` — price is zero
- `"Invalid auction duration"` — duration < 1 hour or > 30 days (auctions only)

**Events**: `ListingCreated(listingId, seller, metadataURI, price, listingType, endTime)`

---

### buyItem

Purchase a fixed-price item immediately (no escrow).

```solidity
function buyItem(uint256 listingId) external payable
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the listing to purchase |

**Payable**: Must send `>= listing.price`

**Reverts**:
- `"Listing not active"` — status is not Active
- `"Not a fixed price listing"` — listing is an auction
- `"Cannot buy own listing"` — msg.sender is seller
- `"Insufficient payment"` — msg.value < price
- `"Transfer to seller failed"` — ETH transfer reverted

**Events**: `ItemPurchased(listingId, buyer, seller, price)`

---

### initiatePurchase

Purchase with escrow protection (recommended).

```solidity
function initiatePurchase(uint256 listingId) external payable
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the listing to purchase |

**Payable**: Must send `>= listing.price`

**Behaviour**:
1. Changes status to `InEscrow`
2. Records buyer address
3. Sets escrowDeadline to `now + 14 days`
4. Refunds excess payment

**Reverts**: Same as `buyItem`

**Events**: `PurchaseInitiated(listingId, buyer, seller, price, escrowDeadline)`

---

### confirmDelivery

Buyer confirms item received, releasing funds to seller.

```solidity
function confirmDelivery(uint256 listingId) external
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the escrowed listing |

**Reverts**:
- `"Not in escrow"` — status is not InEscrow
- `"Only buyer can confirm"` — msg.sender is not listing.buyer
- `"Transfer to seller failed"` — ETH transfer reverted

**Events**: `DeliveryConfirmed(listingId, buyer, seller, price)`

---

### releaseEscrow

Seller releases funds after escrow deadline passes.

```solidity
function releaseEscrow(uint256 listingId) external
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the escrowed listing |

**Reverts**:
- `"Not in escrow"` — status is not InEscrow
- `"Only seller can release"` — msg.sender is not listing.seller
- `"Escrow period not ended"` — block.timestamp < escrowDeadline
- `"Transfer to seller failed"` — ETH transfer reverted

**Events**: `EscrowReleased(listingId, seller, price)`

---

### placeBid

Place a bid on an auction listing.

```solidity
function placeBid(uint256 listingId) external payable
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the auction listing |

**Payable**: Must send `>= minBid`

**Minimum Bid Calculation**:
- First bid: `>= listing.price`
- Subsequent: `>= highestBid + (highestBid * 5 / 100)` (5% increment)

**Reverts**:
- `"Listing not active"` — status is not Active
- `"Not an auction listing"` — listingType is FixedPrice
- `"Auction ended"` — block.timestamp >= endTime
- `"Cannot bid on own listing"` — msg.sender is seller
- `"Bid too low"` — msg.value < minBid

**Events**: `BidPlaced(listingId, bidder, amount)`

---

### withdrawBid

Withdraw pending returns from being outbid.

```solidity
function withdrawBid(uint256 listingId) external
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the auction listing |

**Reverts**:
- `"No funds to withdraw"` — no pending return for caller
- `"Withdrawal failed"` — ETH transfer reverted

---

### endAuction

End an auction and settle with winner.

```solidity
function endAuction(uint256 listingId) external
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the auction listing |

**Behaviour**:
- If bids exist: Transfers funds to seller, emits `AuctionEnded`
- If no bids: Sets status to Cancelled, emits `ListingCancelled`

**Reverts**:
- `"Listing not active"` — status is not Active
- `"Not an auction listing"` — listingType is FixedPrice
- `"Auction not yet ended"` — block.timestamp < endTime
- `"Transfer to seller failed"` — ETH transfer reverted

**Events**: `AuctionEnded(listingId, winner, amount)` or `ListingCancelled(listingId)`

---

### cancelListing

Cancel an active listing (seller only).

```solidity
function cancelListing(uint256 listingId) external
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `listingId` | uint256 | ID of the listing to cancel |

**Reverts**:
- `"Listing not active"` — status is not Active
- `"Not the seller"` — msg.sender is not listing.seller
- `"Cannot cancel auction with bids"` — auction has highestBidder

**Events**: `ListingCancelled(listingId)`

---

### setPlatformFee (Owner only)

Update the platform fee percentage.

```solidity
function setPlatformFee(uint256 newFee) external onlyOwner
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `newFee` | uint256 | New fee in basis points (e.g., 250 = 2.5%) |

**Reverts**:
- `"Fee too high"` — newFee > 1000 (10%)
- OpenZeppelin: `OwnableUnauthorizedAccount` — caller is not owner

**Events**: `PlatformFeeUpdated(oldFee, newFee)`

---

### withdrawFees (Owner only)

Withdraw accumulated platform fees.

```solidity
function withdrawFees() external onlyOwner
```

**Reverts**:
- `"No fees to withdraw"` — contract balance is 0
- OpenZeppelin: `OwnableUnauthorizedAccount` — caller is not owner

---

## 3. Read Functions

### getListing

Get listing details by ID.

```solidity
function getListing(uint256 listingId) external view returns (Listing memory)
```

**Returns**: Full `Listing` struct

**Reverts**: `"Listing does not exist"` — listingId >= _listingIdCounter

---

### getListingsByUser

Get all listing IDs for a user.

```solidity
function getListingsByUser(address user) external view returns (uint256[] memory)
```

**Returns**: Array of listing IDs created by `user`

---

### getActiveListings

Get all currently active listing IDs.

```solidity
function getActiveListings() external view returns (uint256[] memory)
```

**Returns**: Array of listing IDs with status Active

---

### getPlatformFee

Get current platform fee rate.

```solidity
function getPlatformFee() external view returns (uint256)
```

**Returns**: Fee in basis points

---

### getTotalListings

Get total number of listings created.

```solidity
function getTotalListings() external view returns (uint256)
```

**Returns**: Counter value (next listing ID would be this value)

---

### getPendingReturn

Get pending withdrawal amount for a bidder.

```solidity
function getPendingReturn(uint256 listingId, address bidder) external view returns (uint256)
```

**Returns**: Amount in wei available for withdrawal

---

## 4. Events

```solidity
event ListingCreated(
    uint256 indexed listingId,
    address indexed seller,
    string metadataURI,
    uint256 price,
    ListingType listingType,
    uint256 endTime
);

event ItemPurchased(
    uint256 indexed listingId,
    address indexed buyer,
    address indexed seller,
    uint256 price
);

event PurchaseInitiated(
    uint256 indexed listingId,
    address indexed buyer,
    address indexed seller,
    uint256 price,
    uint256 escrowDeadline
);

event DeliveryConfirmed(
    uint256 indexed listingId,
    address indexed buyer,
    address indexed seller,
    uint256 price
);

event EscrowReleased(
    uint256 indexed listingId,
    address indexed seller,
    uint256 price
);

event BidPlaced(
    uint256 indexed listingId,
    address indexed bidder,
    uint256 amount
);

event AuctionEnded(
    uint256 indexed listingId,
    address indexed winner,
    uint256 amount
);

event ListingCancelled(uint256 indexed listingId);

event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
```

---

## 5. API Route: /api/ipfs/upload

Server-side IPFS upload via Pinata.

### Endpoint

`POST /api/ipfs/upload`

### Request (File Upload)

```
Content-Type: multipart/form-data

Fields:
- type: "file"
- file: <File object>
```

### Request (JSON Metadata)

```
Content-Type: multipart/form-data

Fields:
- type: "json"
- data: <JSON string>
```

### Response (Success)

```json
{
  "cid": "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"
}
```

### Response (Error)

```json
{
  "error": "Failed to upload to IPFS",
  "message": "Pinata upload failed: 401 Unauthorized",
  "status": 500
}
```

---

## 6. Failure Modes

### Contract Failures

| Failure | Cause | User Impact | Recovery |
|---------|-------|-------------|----------|
| Tx reverts | Insufficient funds, wrong state | Tx cancelled, gas spent | Retry with correct params |
| Transfer fails | Recipient reverts | Funds stuck | Contact support |
| Gas limit | Complex state changes | Tx incomplete | Increase gas limit |

### IPFS Failures

| Failure | Cause | User Impact | Recovery |
|---------|-------|-------------|----------|
| Upload timeout | Network issues | Cannot create listing | Retry upload |
| Gateway unavailable | Service outage | Images don't load | Automatic fallback to other gateways |
| Content unpinned | Pinata account issue | Metadata lost | Re-pin from local copy |

### RPC Failures

| Failure | Cause | User Impact | Recovery |
|---------|-------|-------------|----------|
| Provider down | Alchemy/Infura outage | Cannot read/write | Switch RPC provider |
| Rate limited | Too many requests | Slow responses | Implement request batching |
| Stale data | Node sync issues | Old state shown | Refresh, use different RPC |

---

## 7. Related Documentation

- [Data & Storage](03-data-and-storage.md) — Data models
- [Sequence Flows](05-sequence-flows.md) — Interaction diagrams
- [Testing](07-testing.md) — Test coverage

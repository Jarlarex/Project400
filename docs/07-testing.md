# Testing

## Purpose

Document the testing strategy, existing test coverage, and how to run tests.

## Scope

Covers smart contract tests and frontend testing approach.

## Audience

Developers maintaining and extending the test suite.

---

## 1. Testing Overview

| Layer | Framework | Location | Status |
|-------|-----------|----------|--------|
| Smart Contract | Hardhat + Chai | `test/Marketplace.test.ts` | ✅ 29+ tests |
| Frontend (Unit) | — | — | Not implemented |
| Frontend (E2E) | — | — | Not implemented |

---

## 2. Running Tests

### Smart Contract Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run test:coverage
```

### Expected Output

```
  Marketplace
    Deployment
      ✓ Should set the correct owner
      ✓ Should set the correct platform fee
      ✓ Should reject deployment with fee too high
    Fixed Price Listings
      ✓ Should create a fixed price listing
      ✓ Should reject listing with empty metadata
      ✓ Should reject listing with zero price
      ✓ Should allow buying a fixed price item
      ✓ Should reject buying own listing
      ✓ Should reject insufficient payment
      ✓ Should refund excess payment
    Auction Listings
      ✓ Should create an auction listing
      ✓ Should reject auction with invalid duration
      ✓ Should allow placing bids
      ✓ Should require minimum bid increment
      ✓ Should allow outbid users to withdraw
      ✓ Should end auction and transfer funds to seller
      ✓ Should reject ending auction before time
      ✓ Should cancel auction with no bids
    Listing Cancellation
      ✓ Should allow seller to cancel fixed price listing
      ✓ Should allow seller to cancel auction with no bids
      ✓ Should reject cancelling auction with bids
      ✓ Should reject non-seller cancellation
    View Functions
      ✓ Should return user listings
      ✓ Should return active listings
      ✓ Should return total listings count
    Platform Fee Management
      ✓ Should allow owner to update fee
      ✓ Should reject non-owner fee update
      ✓ Should reject fee above maximum
      ✓ Should allow owner to withdraw fees

  29 passing (2s)
```

---

## 3. Test Structure

### Test File Organisation

```typescript
// test/Marketplace.test.ts

describe("Marketplace", function () {
  // Constants
  const PLATFORM_FEE = 250;
  const ONE_ETH = ethers.parseEther("1");
  
  // Fixture for fresh contract deployment
  async function deployMarketplaceFixture() {
    const [owner, seller, buyer, bidder1, bidder2] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(PLATFORM_FEE);
    return { marketplace, owner, seller, buyer, bidder1, bidder2 };
  }
  
  describe("Deployment", function () { ... });
  describe("Fixed Price Listings", function () { ... });
  describe("Auction Listings", function () { ... });
  describe("Listing Cancellation", function () { ... });
  describe("View Functions", function () { ... });
  describe("Platform Fee Management", function () { ... });
});
```

### Fixture Pattern

Tests use Hardhat's `loadFixture` for clean state:

```typescript
it("Should create a listing", async function () {
  // Fresh contract and accounts for each test
  const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
  
  // Test logic
  await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
  
  // Assertions
  const listing = await marketplace.getListing(0);
  expect(listing.seller).to.equal(seller.address);
});
```

---

## 4. Test Coverage by Feature

### Listing Creation

| Test Case | Status |
|-----------|--------|
| Create fixed-price listing | ✅ |
| Create auction listing | ✅ |
| Reject empty metadata | ✅ |
| Reject zero price | ✅ |
| Reject invalid auction duration | ✅ |
| Event emission (ListingCreated) | ✅ |

### Fixed-Price Purchase

| Test Case | Status |
|-----------|--------|
| Buy at exact price | ✅ |
| Refund excess payment | ✅ |
| Reject own listing purchase | ✅ |
| Reject insufficient payment | ✅ |
| Seller receives (price - fee) | ✅ |
| Status changes to Sold | ✅ |

### Escrow (Assumption: needs additional tests)

| Test Case | Status |
|-----------|--------|
| Initiate purchase with escrow | ⚠️ Not explicitly tested |
| Confirm delivery | ⚠️ Not explicitly tested |
| Release after deadline | ⚠️ Not explicitly tested |

### Auctions

| Test Case | Status |
|-----------|--------|
| Place first bid at starting price | ✅ |
| Enforce 5% minimum increment | ✅ |
| Withdraw outbid funds | ✅ |
| End auction with bids | ✅ |
| Reject early end | ✅ |
| Cancel no-bid auction | ✅ |

### Cancellation

| Test Case | Status |
|-----------|--------|
| Seller cancels fixed-price | ✅ |
| Seller cancels no-bid auction | ✅ |
| Reject cancel auction with bids | ✅ |
| Reject non-seller cancel | ✅ |

### Admin Functions

| Test Case | Status |
|-----------|--------|
| Owner updates fee | ✅ |
| Reject non-owner fee update | ✅ |
| Reject fee above maximum | ✅ |
| Owner withdraws fees | ✅ |

---

## 5. Time Manipulation

For auction tests, use Hardhat's time helpers:

```typescript
import { time } from "@nomicfoundation/hardhat-network-helpers";

// Fast forward time
await time.increase(ONE_DAY);

// Set specific timestamp
await time.increaseTo(futureTimestamp);
```

---

## 6. Event Testing

Tests verify events are emitted correctly:

```typescript
await expect(
  marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0)
)
  .to.emit(marketplace, "ListingCreated")
  .withArgs(0, seller.address, METADATA_URI, ONE_ETH, 0, 0);
```

---

## 7. Revert Testing

Tests verify correct revert messages:

```typescript
await expect(
  marketplace.connect(buyer).cancelListing(0)
).to.be.revertedWith("Not the seller");

// For OpenZeppelin custom errors
await expect(
  marketplace.connect(seller).setPlatformFee(500)
).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
```

---

## 8. Balance Verification

Tests verify ETH transfers:

```typescript
const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

await marketplace.connect(buyer).buyItem(0, { value: ONE_ETH });

const expectedPayment = ONE_ETH - (ONE_ETH * BigInt(PLATFORM_FEE)) / BigInt(10000);
const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedPayment);
```

---

## 9. Frontend Testing Strategy

### Recommended Approach (Not Yet Implemented)

| Level | Tool | Target |
|-------|------|--------|
| Unit | Vitest / Jest | Utility functions (`ipfs.ts`, `useMarketplace.ts`) |
| Component | React Testing Library | UI components (`ListingCard`, `IpfsImage`) |
| Integration | Cypress / Playwright | Full user flows with mock contract |
| E2E | Cypress + Hardhat | Real contract on local network |

### Example Unit Test (ipfs.ts)

```typescript
// frontend/src/lib/__tests__/ipfs.test.ts
import { isValidCID, ipfsToHttpUrls } from '../ipfs';

describe('isValidCID', () => {
  it('validates CIDv0', () => {
    expect(isValidCID('QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB')).toBe(true);
  });
  
  it('validates CIDv1', () => {
    expect(isValidCID('bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku')).toBe(true);
  });
  
  it('rejects invalid CID', () => {
    expect(isValidCID('test123')).toBe(false);
  });
});

describe('ipfsToHttpUrls', () => {
  it('converts ipfs:// to gateway URLs', () => {
    const urls = ipfsToHttpUrls('ipfs://QmTest');
    expect(urls[0]).toContain('https://');
    expect(urls[0]).toContain('QmTest');
  });
});
```

---

## 10. Test Gaps and TODOs

| Gap | Priority | Notes |
|-----|----------|-------|
| Escrow flow tests | High | initiatePurchase, confirmDelivery, releaseEscrow |
| Frontend unit tests | Medium | Utility functions, hooks |
| E2E tests | Low | Full user journey automation |
| Gas optimisation tests | Low | Benchmark gas usage |
| Fuzzing | Low | Property-based testing for edge cases |

---

## 11. Related Documentation

- [API & Contracts](04-api-and-contracts.md) — Functions being tested
- [Deployment](06-deployment-and-ops.md) — Running tests in CI
- [Security](../SECURITY.md) — Security-related test coverage

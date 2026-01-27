# Security

This document outlines the threat model, known risks, and security mitigations for DecentraMarket.

---

## Purpose

Provide transparency about security considerations and guide secure usage of the platform.

## Scope

Covers smart contract security, frontend security, and operational security.

## Audience

Developers, security reviewers, and users concerned about platform security.

---

## 🛡️ Threat Model Summary

### Assets at Risk

| Asset | Value | Location |
|-------|-------|----------|
| User Funds (ETH) | Variable | Smart contract, user wallets |
| Listing Data | Low-Medium | On-chain (URI), IPFS (content) |
| Private Keys | Critical | User responsibility (MetaMask) |
| Platform Fees | Variable | Smart contract balance |

### Threat Actors

| Actor | Motivation | Capability |
|-------|------------|------------|
| Malicious Seller | Financial gain | Social engineering, fake listings |
| Malicious Buyer | Free items | Dispute abuse, non-payment |
| External Attacker | Financial gain | Contract exploits, phishing |
| Network Attacker | Disruption | RPC manipulation, IPFS attacks |

---

## 🔒 Smart Contract Security

### Implemented Mitigations

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| Reentrancy | ReentrancyGuard | OpenZeppelin modifier on all state-changing functions |
| Integer Overflow | Solidity 0.8+ | Built-in overflow checks |
| Unauthorised Admin | Ownable | Only owner can withdraw fees, update fee rate |
| Excessive Fees | MAX_PLATFORM_FEE | Capped at 10% (1000 basis points) |
| Self-Trading | Explicit Check | `require(msg.sender != listing.seller)` |
| Invalid Input | Validation | Non-zero price, valid metadata URI, duration bounds |

### Code Patterns

```solidity
// Reentrancy protection
function buyItem(uint256 listingId) external payable override nonReentrant {
    // State changes BEFORE external calls (Checks-Effects-Interactions)
    listing.status = ListingStatus.Sold;
    _removeFromActiveListings(listingId);
    
    // External call LAST
    (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
    require(success, "Transfer failed");
}

// Pull pattern for refunds
mapping(uint256 => mapping(address => uint256)) private _pendingReturns;

function withdrawBid(uint256 listingId) external nonReentrant {
    uint256 amount = _pendingReturns[listingId][msg.sender];
    require(amount > 0, "No funds");
    
    _pendingReturns[listingId][msg.sender] = 0; // Clear BEFORE transfer
    
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Withdrawal failed");
}
```

### Verified on Etherscan

Contract source code is verified and publicly readable:
- [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b#code)

---

## 🌐 Frontend Security

### Implemented Mitigations

| Threat | Mitigation |
|--------|------------|
| API Key Exposure | Pinata JWT stored server-side only (`PINATA_JWT` not `NEXT_PUBLIC_*`) |
| XSS | React's built-in escaping, no `dangerouslySetInnerHTML` |
| CSRF | SameSite cookies (Next.js default) |
| Transaction Manipulation | All critical logic on-chain, frontend is display only |

### Trust Assumptions

The frontend should be treated as **untrusted**. The smart contract is the source of truth:
- Price shown must match `msg.value` sent
- Listing status verified on-chain before actions
- User can interact with contract directly via Etherscan

---

## ⚠️ Known Risks and Limitations

### 1. Escrow Dispute Resolution

**Risk**: No on-chain dispute mechanism. If seller ships wrong item, buyer has no recourse after confirming delivery.

**Mitigation**: 
- Buyers should verify items before calling `confirmDelivery()`
- 14-day escrow period allows time for verification
- Future: Could add multi-sig arbitration

### 2. IPFS Availability

**Risk**: If Pinata unpins content or service goes down, metadata becomes unavailable.

**Mitigation**:
- Multiple IPFS gateway fallbacks implemented
- Listing still exists on-chain (metadataURI preserved)
- Users can re-pin content to any IPFS node

### 3. Front-running

**Risk**: Miner/validator could see pending transactions and front-run purchases.

**Assessment**: Low risk on Sepolia testnet. On mainnet, consider:
- Commit-reveal schemes for auctions
- Private transaction pools (Flashbots)

### 4. Private Key Security

**Risk**: User private key compromise leads to fund loss.

**Mitigation**: 
- Education: Never share seed phrase
- Hardware wallets recommended for significant funds
- This is outside application scope — user responsibility

### 5. Smart Contract Immutability

**Risk**: Bugs in deployed contract cannot be fixed without redeployment.

**Mitigation**:
- Comprehensive test suite (29+ tests)
- Code review and documentation
- Future: Consider upgradeable proxy pattern for production

---

## 🔍 Security Audit Status

| Status | Details |
|--------|---------|
| **Formal Audit** | Not performed (educational project) |
| **Test Coverage** | 29+ unit tests covering core flows |
| **Static Analysis** | Hardhat built-in checks |
| **Manual Review** | Developer review completed |

**Recommendation**: For production use, commission a professional security audit.

---

## 📋 Responsible Disclosure

If you discover a security vulnerability:

1. **Do not** disclose publicly
2. **Do not** exploit the vulnerability
3. Contact: Open a private issue on GitHub or email the maintainer
4. Allow reasonable time for fix before disclosure

---

## 🔗 Related Documentation

- [Architecture](ARCHITECTURE.md) — Trust model details
- [API & Contracts](docs/04-api-and-contracts.md) — Function specifications
- [Testing](docs/07-testing.md) — Test coverage details

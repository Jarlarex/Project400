# Literature Review Blueprint

## Purpose

Provide a structured foundation for an academic literature review covering the technologies and concepts used in decentralised application development.

## Scope

This document covers the **technologies used, not the project itself**. It explains what each technology is, why it exists, how dApps differ from traditional web apps, and the historical evolution of the space.

## Audience

Students writing academic papers on blockchain and dApp development.

---

## 1. Introduction and Framing

### Suggested Opening

> The emergence of blockchain technology and decentralised applications (dApps) represents a paradigm shift in how software systems handle trust, data ownership, and intermediation. This literature review examines the foundational technologies enabling decentralised marketplaces, contrasting them with traditional centralised architectures.

### Central Themes

1. **Trust minimisation** — Replacing trusted intermediaries with cryptographic verification
2. **Immutability** — Data that cannot be altered once recorded
3. **Transparency** — Open, auditable systems
4. **User sovereignty** — Users control their identity and assets

---

## 2. Chronological Narrative

### 2007–2009: Bitcoin and the Genesis of Blockchain

**Core Concepts**:
- Satoshi Nakamoto's 2008 whitepaper introduced a peer-to-peer electronic cash system
- First practical solution to the double-spending problem without trusted third parties
- Proof of Work (PoW) consensus mechanism
- The first blockchain: an append-only ledger of transactions

**How This Project Uses It**:
- Ethereum, used in this project, inherited Bitcoin's blockchain concept
- The immutable transaction history concept applies to marketplace listings

**Limitations**:
- Bitcoin's scripting language is intentionally limited
- Cannot express complex business logic (e.g., escrow with conditions)

**Keywords for Research**:
- "Bitcoin whitepaper" "Nakamoto 2008"
- "Byzantine fault tolerance" "double spending"
- "Proof of Work consensus" "distributed ledger"

---

### 2013–2015: Ethereum and Smart Contracts

**Core Concepts**:
- Vitalik Buterin's Ethereum whitepaper (2013) proposed a Turing-complete blockchain
- Smart contracts: self-executing code deployed on-chain
- The Ethereum Virtual Machine (EVM) as a global computer
- Solidity programming language for contract development

**How This Project Uses It**:
- Marketplace.sol is a Solidity smart contract
- Business logic (escrow, auctions, fee calculation) enforced by contract code
- Events enable off-chain indexing and UI updates
- OpenZeppelin contracts provide audited base implementations

```solidity
// Example from this project: Escrow logic
function confirmDelivery(uint256 listingId) external override nonReentrant {
    Listing storage listing = _listings[listingId];
    require(listing.status == ListingStatus.InEscrow, "Not in escrow");
    require(msg.sender == listing.buyer, "Only buyer can confirm");
    // State change and fund transfer...
}
```

**Comparison to Traditional Apps**:

| Aspect | Traditional (e.g., PayPal) | Smart Contract (this project) |
|--------|---------------------------|------------------------------|
| Escrow Logic | Server-side code, company-controlled | On-chain, immutable, verifiable |
| Dispute Resolution | Human arbitrators | Predetermined rules (timeout) |
| Trust | Trust PayPal to execute fairly | Trust the code (auditable) |

**Limitations**:
- Immutability means bugs cannot be patched
- Gas costs for computation
- Limited data storage capacity

**Keywords for Research**:
- "Ethereum whitepaper" "Buterin 2013"
- "Smart contracts" "Szabo 1996"
- "Solidity programming language"
- "EVM Ethereum Virtual Machine"
- "OpenZeppelin security patterns"

---

### 2017: The ICO Wave and Token Standards

**Core Concepts** (Brief, Contextual):
- Initial Coin Offerings (ICOs) raised billions for blockchain projects
- ERC-20 token standard enabled fungible token creation
- ERC-721 standard enabled non-fungible tokens (NFTs)
- Demonstrated both potential and risks of open blockchain systems

**Relevance to This Project**:
- This project uses native ETH rather than custom tokens
- The escrow pattern could be extended to support ERC-20 payments
- NFT marketplace patterns (ERC-721) influenced metadata standards used here

**Keywords for Research**:
- "ERC-20 token standard"
- "ERC-721 NFT standard"
- "Token economics" "ICO regulation"

---

### 2020–2021: DeFi, NFTs, and Web3 Momentum

**Core Concepts**:
- Decentralised Finance (DeFi): financial services without intermediaries
- NFT boom: digital ownership and provenance
- Web3: vision of user-owned internet infrastructure
- IPFS and Filecoin for decentralised storage

**How This Project Uses It**:
- IPFS stores listing images and metadata
- Content addressing (CID = hash) ensures data integrity
- Pinata provides reliable pinning service
- Multiple gateway fallbacks for resilience

```typescript
// From this project: IPFS gateway fallbacks
const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
];
```

**Comparison to Traditional Apps**:

| Aspect | Traditional Storage | IPFS (this project) |
|--------|--------------------|--------------------|
| Addressing | Location (URL) | Content (CID hash) |
| Mutability | Server can change content | Content immutable, different content = different CID |
| Availability | Single point of failure | Distributed across nodes |
| Trust | Trust server operator | Verify content matches hash |

**Keywords for Research**:
- "IPFS InterPlanetary File System"
- "Content addressing" "content-addressed storage"
- "Filecoin incentivised storage"
- "Pinning services" "data availability"
- "DeFi decentralised finance"
- "NFT non-fungible tokens"

---

### 2022–Present: Scaling, Modularity, and Account Abstraction

**Core Concepts** (Contextual Background):
- Layer 2 scaling solutions (Optimism, Arbitrum, zkSync)
- Modular blockchain architecture
- Account abstraction (EIP-4337) improving UX
- Proof of Stake transition (Ethereum "Merge")

**Relevance to This Project**:
- Project currently uses Sepolia testnet (PoS)
- L2 deployment would reduce gas costs significantly
- Account abstraction could enable gasless transactions for users

**Note**: These are mentioned for completeness but are not directly implemented in the current project.

**Keywords for Research**:
- "Layer 2 scaling" "Optimistic rollups" "ZK rollups"
- "Account abstraction EIP-4337"
- "Ethereum Merge Proof of Stake"
- "Modular blockchain architecture"

---

## 3. Key Technology Themes

### Theme A: Blockchain Fundamentals

**Core Concepts**:
- Distributed ledger replicated across nodes
- Blocks linked by cryptographic hashes
- Consensus mechanisms ensure agreement
- State: the current data at any block height
- Transactions: signed instructions that modify state

**How This Project Uses It**:
- Each `createListing` call creates a transaction
- Transaction receipt confirms listing was created
- State (`_listings` mapping) queryable by anyone
- Events logged for off-chain indexing

**Comparison to Traditional**:
- Traditional: Single database, operator controls
- Blockchain: Replicated state, consensus controls

**Limitations**:
- Throughput limited by block size and time
- Storage expensive (gas costs)
- Finality takes time (block confirmations)

**Keywords for Research**:
- "Distributed ledger technology"
- "Blockchain consensus mechanisms"
- "State machine replication"
- "Byzantine fault tolerance"

---

### Theme B: Smart Contracts and Execution

**Core Concepts**:
- Deterministic code execution across all nodes
- Immutable once deployed (code cannot change)
- State variables persist between calls
- Functions can be called by transactions or other contracts
- Events provide logs for off-chain systems

**How This Project Uses It**:
- `Marketplace.sol` contains all business logic
- Inheritance from OpenZeppelin (ReentrancyGuard, Ownable)
- State: listings, user mappings, pending returns
- Events: ListingCreated, ItemPurchased, etc.

**Comparison to Traditional**:
- Traditional: Server can modify logic at any time
- Smart Contract: Code is law, immutable

**Limitations**:
- Cannot call external APIs (oracles needed)
- Limited gas per transaction
- Bugs are permanent (upgrade patterns exist but add complexity)

**Keywords for Research**:
- "Smart contract execution model"
- "Solidity programming"
- "EVM opcodes"
- "Contract verification"
- "Formal verification smart contracts"

---

### Theme C: Wallet-Based Authentication

**Core Concepts**:
- No username/password; private key proves identity
- Wallet signs transactions locally
- Address derived from public key
- EIP-1193 standard for wallet integration
- MetaMask as de facto browser wallet

**How This Project Uses It**:
- `WalletContext.tsx` manages MetaMask connection
- `eth_requestAccounts` prompts user for access
- Signer used for transaction signing
- Address displayed as user identity

```typescript
// From this project: Wallet connection
const accounts = await window.ethereum.request({
  method: "eth_requestAccounts",
});
```

**Comparison to Traditional**:
- Traditional: Server stores password hashes, can reset
- Wallet: User controls keys, cannot be reset by anyone
- Traditional: Session cookies/JWT
- Wallet: Sign every transaction

**Limitations**:
- Lost keys = lost access (no recovery)
- Phishing attacks can steal signatures
- UX friction (popups, confirmations)

**Keywords for Research**:
- "Cryptographic authentication"
- "Public key infrastructure"
- "Wallet security"
- "EIP-1193 Ethereum provider"
- "MetaMask integration"

---

### Theme D: Decentralised Storage (IPFS)

**Core Concepts**:
- Content-addressed storage: CID = hash(content)
- Peer-to-peer distribution
- No central server controls content
- Pinning ensures availability
- Gateways bridge IPFS to HTTP

**How This Project Uses It**:
- Images uploaded to Pinata → CID returned
- Metadata JSON references image CID
- MetadataURI stored on-chain (small string, low cost)
- Multiple gateways for retrieval resilience

**Comparison to Traditional**:
- Traditional: `https://example.com/image.jpg` (location)
- IPFS: `ipfs://bafkrei...` (content)
- Traditional: Server can change image
- IPFS: CID changes if content changes

**Limitations**:
- Depends on at least one node pinning content
- Latency can be high for cold content
- Gateway availability varies

**Keywords for Research**:
- "IPFS protocol specification"
- "Content-addressed storage"
- "Merkle DAG"
- "Pinning services"
- "Data availability problem"

---

### Theme E: Client Libraries and Tooling

**Core Concepts**:
- ethers.js / web3.js for JavaScript interaction
- Hardhat / Foundry for development and testing
- TypeChain for type-safe contract bindings
- OpenZeppelin for audited contract libraries

**How This Project Uses It**:
- ethers.js v6 for frontend contract interaction
- Hardhat for compilation, testing, deployment
- TypeChain generates TypeScript types
- OpenZeppelin's ReentrancyGuard and Ownable

```typescript
// From this project: Contract interaction with ethers.js
const tx = await marketplace.createListing(
  metadataURI,
  priceWei,
  isAuction,
  duration
);
await tx.wait();
```

**Comparison to Traditional**:
- Traditional: REST APIs with HTTP client
- dApp: JSON-RPC with blockchain-specific library
- Traditional: Simple request/response
- dApp: Transaction lifecycle (pending → mined → confirmed)

**Keywords for Research**:
- "ethers.js documentation"
- "Hardhat development environment"
- "Solidity testing frameworks"
- "TypeChain type generation"

---

### Theme F: Security and Threat Models

**Core Concepts**:
- Reentrancy attacks
- Integer overflow (mitigated in Solidity 0.8+)
- Front-running and MEV
- Access control
- Input validation

**How This Project Uses It**:
- `nonReentrant` modifier on all state-changing functions
- Checks-Effects-Interactions pattern
- `onlyOwner` for admin functions
- Input validation in every public function

**Comparison to Traditional**:
- Traditional: SQL injection, XSS, CSRF
- Smart Contract: Reentrancy, overflow, access control
- Both: Need defence in depth

**Limitations**:
- Immutable code means bugs persist
- No "security patches" without redeployment
- Users must trust audit quality

**Keywords for Research**:
- "Smart contract security"
- "Reentrancy attack"
- "OpenZeppelin security"
- "Smart contract auditing"
- "Formal verification"

---

### Theme G: UX Trade-offs and Scalability

**Core Concepts**:
- Gas fees make every action cost money
- Transaction confirmation takes time (seconds to minutes)
- Users must understand wallet signatures
- Network congestion increases costs
- Layer 2 solutions address scalability

**How This Project Experiences It**:
- Users pay gas for listing creation, purchases
- 12+ second wait for transaction confirmation
- MetaMask popups for every transaction
- Testing on Sepolia with free testnet ETH

**Comparison to Traditional**:
- Traditional: Instant responses, no user-visible costs
- dApp: Wait for confirmation, visible gas fees
- Traditional: "Undo" often possible
- dApp: Transactions irreversible

**Keywords for Research**:
- "Blockchain scalability trilemma"
- "Layer 2 scaling solutions"
- "Gas optimisation"
- "User experience decentralised applications"
- "Web3 onboarding"

---

## 4. Recommended Structure for Literature Review

```
1. Introduction
   - Context: Rise of decentralised systems
   - Motivation: Trust, transparency, user sovereignty
   - Scope: Technologies enabling dApps

2. Background: From Bitcoin to Smart Contracts
   - 2.1 Bitcoin and distributed ledgers
   - 2.2 Ethereum and programmable blockchain
   - 2.3 Evolution of the ecosystem (2017–present)

3. Core Technologies
   - 3.1 Blockchain fundamentals
   - 3.2 Smart contract execution
   - 3.3 Wallet-based authentication
   - 3.4 Decentralised storage (IPFS)
   - 3.5 Development tooling

4. Comparison: dApps vs Traditional Web Applications
   - 4.1 Architecture differences
   - 4.2 Trust models
   - 4.3 Data ownership and control
   - 4.4 User experience trade-offs

5. Security Considerations
   - 5.1 Smart contract vulnerabilities
   - 5.2 Mitigation patterns
   - 5.3 Audit and verification

6. Current Limitations and Future Directions
   - 6.1 Scalability challenges
   - 6.2 Emerging solutions (L2, abstraction)
   - 6.3 Regulatory considerations

7. Conclusion
   - Summary of findings
   - Implications for future development
```

---

## 5. Official Documentation Sources

| Technology | Official Source |
|------------|-----------------|
| Ethereum | https://ethereum.org/en/developers/docs/ |
| Solidity | https://docs.soliditylang.org/ |
| ethers.js | https://docs.ethers.org/v6/ |
| Hardhat | https://hardhat.org/docs |
| OpenZeppelin | https://docs.openzeppelin.com/contracts/ |
| IPFS | https://docs.ipfs.tech/ |
| Pinata | https://docs.pinata.cloud/ |
| MetaMask | https://docs.metamask.io/ |
| EIPs (Standards) | https://eips.ethereum.org/ |

---

## 6. Suggested Academic References

**Foundational Papers**:
- Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System
- Buterin, V. (2014). Ethereum White Paper
- Wood, G. (2014). Ethereum Yellow Paper

**Security**:
- Atzei, N., Bartoletti, M., & Cimoli, T. (2017). A Survey of Attacks on Ethereum Smart Contracts

**IPFS**:
- Benet, J. (2014). IPFS - Content Addressed, Versioned, P2P File System

**General**:
- Antonopoulos, A. & Wood, G. (2018). Mastering Ethereum (O'Reilly)

---

## 7. Related Project Documentation

- [System Architecture](02-system-architecture.md) — How these technologies are applied
- [Data & Storage](03-data-and-storage.md) — On-chain vs off-chain implementation
- [API & Contracts](04-api-and-contracts.md) — Smart contract specifics
- [Security](../SECURITY.md) — Threat model for this project
- [Glossary](08-glossary.md) — Term definitions

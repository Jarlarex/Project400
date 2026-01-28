# Literature Review Blueprint

## Document Information

| Field | Value |
|-------|-------|
| **Author** | Iarfhlaith Feeney (S00238682) |
| **Institution** | Atlantic Technological University (ATU) Sligo |
| **Module** | Project 400 |
| **Date** | January 2026 |

---

# Chapter 1: Introduction

## 1.1 Purpose of the Literature Review

This literature review examines the foundational technologies, historical development, and current state of blockchain technology and decentralised applications (dApps). The review aims to:

1. **Establish context** for the development of a decentralised marketplace application
2. **Evaluate existing technologies** used in building trustless peer-to-peer systems
3. **Identify gaps** in current marketplace solutions that the project addresses
4. **Provide theoretical grounding** for architectural and design decisions

The scope focuses primarily on Ethereum blockchain technology, smart contract development, decentralised storage solutions, and wallet-based authentication systems—the core technologies employed in this project.

## 1.2 Introduction to the Project

DecentraMarket is a decentralised marketplace built on the Ethereum blockchain, enabling peer-to-peer trading without centralised intermediaries. The application demonstrates key dApp development patterns including:

- Smart contract-based business logic
- Wallet-based authentication (MetaMask)
- Decentralised storage (IPFS via Pinata)
- Escrow-protected transactions
- Both fixed-price and auction sale formats

> **📊 SUGGESTED GRAPHIC: Project Architecture Diagram**
> 
> Insert the system architecture diagram from `ARCHITECTURE.md` here as an example of typical dApp architecture. This provides readers with a concrete reference point when discussing abstract concepts throughout the review.

The project serves as both a functional marketplace and an educational demonstration of how decentralised technologies can replace traditional centralised platforms.

---

# Chapter 2: Methodology and Search Strategy

## 2.1 Web Search and Search Terms

The following search engines and platforms were used for general research:

| Platform | Purpose |
|----------|---------|
| Google Scholar | Academic papers and citations |
| Google | Technical documentation, tutorials, blog posts |
| Medium | Developer experiences and tutorials |
| Stack Overflow | Technical implementation details |
| GitHub | Open-source code examples and documentation |

### Primary Search Terms

**Blockchain Fundamentals:**
- "blockchain technology overview"
- "distributed ledger technology"
- "consensus mechanisms proof of work proof of stake"
- "Byzantine fault tolerance"

**Ethereum and Smart Contracts:**
- "Ethereum smart contracts"
- "Solidity programming language"
- "EVM Ethereum Virtual Machine"
- "dApp development"

**Decentralised Storage:**
- "IPFS InterPlanetary File System"
- "content-addressed storage"
- "decentralised file storage"

**Security and Patterns:**
- "smart contract security vulnerabilities"
- "reentrancy attack prevention"
- "blockchain authentication"

## 2.2 Academic Journals

Academic literature was accessed through **Atlantic Technological University (ATU) Sligo's** institutional subscriptions, providing access to peer-reviewed research from:

| Database | Access Method | Key Resources |
|----------|---------------|---------------|
| **IEEE Xplore** | ATU Sligo subscription | Conference papers on blockchain protocols, security analysis |
| **ResearchGate** | Free access + ATU institutional | Preprints and published papers from blockchain researchers |
| **ACM Digital Library** | ATU Sligo subscription | Computing research, smart contract analysis |
| **ScienceDirect** | ATU Sligo subscription | Information systems, distributed computing |
| **arXiv** | Open access | Preprints on cryptography and protocols |

### Key Academic Search Queries

```
IEEE: "blockchain" AND "smart contracts" AND "security"
IEEE: "decentralized applications" AND "Ethereum"
ResearchGate: "IPFS" AND "decentralized storage"
ACM: "cryptocurrency" AND "marketplace"
```

## 2.3 AI Tools

Artificial intelligence tools were utilised to assist with research synthesis and technical understanding:

| Tool | Usage |
|------|-------|
| **Claude (Anthropic)** | Code assistance, documentation writing, concept explanation |
| **ChatGPT (OpenAI)** | Research synthesis, alternative explanations |
| **GitHub Copilot** | Code completion and pattern suggestions |

**Important Note:** AI tools were used to assist understanding and accelerate development, not to generate original research findings. All claims in this review are supported by cited sources or clearly marked as observations from the project.

---

# Chapter 3: What is Blockchain Technology?

## 3.1 Definition and Core Concepts

A blockchain is a **distributed, immutable ledger** that records transactions across a network of computers. Rather than storing data in a central database controlled by a single entity, blockchain distributes identical copies across thousands of nodes worldwide.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Distributed** | Data replicated across all network nodes |
| **Immutable** | Once recorded, data cannot be altered |
| **Transparent** | All transactions publicly visible |
| **Trustless** | No single party controls the system |
| **Consensus-driven** | Network agrees on valid state |

> **📊 SUGGESTED GRAPHIC: Blockchain Structure Diagram**
> 
> A visual showing blocks linked by hashes, containing transactions, timestamps, and previous block references. Illustrate how changing one block invalidates all subsequent blocks.

### How Blocks Are Linked

```
Block N-1                    Block N                      Block N+1
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Hash: 0x7a3f... │◄────────│ Prev: 0x7a3f... │◄────────│ Prev: 0x9b2c... │
│ Prev: 0x5c2d... │         │ Hash: 0x9b2c... │         │ Hash: 0xe4f1... │
│ Timestamp       │         │ Timestamp       │         │ Timestamp       │
│ Transactions[]  │         │ Transactions[]  │         │ Transactions[]  │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 3.2 A Brief History of Blockchain

### Pre-Bitcoin Era (1991–2007)

The conceptual foundations of blockchain predate Bitcoin:

- **1991**: Stuart Haber and W. Scott Stornetta proposed cryptographically secured chains of blocks for timestamping documents
- **1998**: Nick Szabo conceptualised "bit gold," a decentralised digital currency
- **2004**: Hal Finney developed "reusable proof of work" (RPOW)

### The Bitcoin Era (2008–2013)

| Year | Event |
|------|-------|
| **2008** | Satoshi Nakamoto publishes "Bitcoin: A Peer-to-Peer Electronic Cash System" |
| **2009** | Bitcoin network launches; first block ("genesis block") mined |
| **2010** | First real-world Bitcoin transaction (10,000 BTC for two pizzas) |
| **2011** | Alternative cryptocurrencies ("altcoins") emerge |
| **2013** | Bitcoin reaches $1,000 for first time |

Bitcoin solved the **double-spending problem** without requiring trusted intermediaries—a breakthrough that enabled truly peer-to-peer digital cash.

### The Ethereum Era (2014–2017)

| Year | Event |
|------|-------|
| **2013** | Vitalik Buterin publishes Ethereum whitepaper |
| **2014** | Ethereum crowdfunding raises $18 million |
| **2015** | Ethereum mainnet launches with smart contract capability |
| **2016** | "The DAO" hack leads to Ethereum/Ethereum Classic split |
| **2017** | ICO boom; Ethereum price rises from $8 to $1,400 |

Ethereum introduced **smart contracts**—self-executing code that runs on the blockchain—enabling far more than simple value transfer.

> **📊 SUGGESTED GRAPHIC: Blockchain Timeline**
> 
> A horizontal timeline showing key milestones from 1991 to present, with Bitcoin, Ethereum, and major events marked.

### The Rise, Hype, and Reality (2017–Present)

**2017–2018: The ICO Boom**
- Initial Coin Offerings raised over $20 billion
- Speculative mania drove prices to unsustainable levels
- Many projects failed or were revealed as scams

**2018–2019: The "Crypto Winter"**
- Bitcoin fell from $20,000 to $3,200
- Many blockchain projects shut down
- Focus shifted from speculation to building

**2020–2021: DeFi and NFT Explosion**
- Decentralised Finance (DeFi) enabled lending, trading without banks
- Non-Fungible Tokens (NFTs) brought mainstream attention
- Institutional adoption increased

**2022–Present: Maturation**
- Ethereum transitioned to Proof of Stake ("The Merge")
- Layer 2 scaling solutions gained adoption
- Regulatory scrutiny increased globally
- Focus on practical utility over speculation

---

# Chapter 4: Understanding Ethereum and Smart Contracts

## 4.1 What is Ethereum?

Ethereum is a **decentralised computing platform** that extends blockchain beyond simple transactions. While Bitcoin is primarily a payment network, Ethereum is a programmable blockchain where developers can deploy **smart contracts**—code that executes automatically when conditions are met.

### Ethereum vs Bitcoin

| Aspect | Bitcoin | Ethereum |
|--------|---------|----------|
| **Primary Purpose** | Digital currency | Programmable platform |
| **Scripting** | Limited (Bitcoin Script) | Turing-complete (Solidity) |
| **Block Time** | ~10 minutes | ~12 seconds |
| **Consensus** | Proof of Work | Proof of Stake (since 2022) |
| **Smart Contracts** | Basic multisig only | Full application logic |

## 4.2 Smart Contracts Explained

A smart contract is **code deployed to the blockchain** that executes automatically and deterministically. Once deployed, the code cannot be changed, and execution cannot be stopped.

### Properties of Smart Contracts

| Property | Explanation |
|----------|-------------|
| **Immutable** | Code cannot be modified after deployment |
| **Deterministic** | Same inputs always produce same outputs |
| **Transparent** | Source code publicly visible (if verified) |
| **Trustless** | Execution guaranteed by network consensus |

### Example: Escrow Logic

```solidity
// Simplified escrow from this project
function confirmDelivery(uint256 listingId) external {
    require(listing.status == InEscrow, "Not in escrow");
    require(msg.sender == listing.buyer, "Only buyer can confirm");
    
    listing.status = Sold;
    payable(listing.seller).transfer(listing.price);
}
```

This code guarantees that:
1. Only the buyer can confirm delivery
2. Funds transfer automatically upon confirmation
3. No intermediary can interfere with the process

> **📊 SUGGESTED GRAPHIC: Smart Contract Execution Flow**
> 
> Diagram showing: User → Signs Transaction → Network Validates → Contract Executes → State Updates → Event Emitted

## 4.3 The Ethereum Virtual Machine (EVM)

The **EVM** is the runtime environment where smart contracts execute. Every Ethereum node runs an identical EVM, ensuring all nodes reach the same result for any computation.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Gas** | Unit of computation; users pay gas fees |
| **Bytecode** | Compiled contract code deployed to chain |
| **State** | Current data stored in contracts |
| **Opcodes** | Low-level instructions executed by EVM |

## 4.4 Solidity Programming Language

**Solidity** is the primary language for Ethereum smart contracts. It is:
- Statically typed
- Influenced by JavaScript, Python, and C++
- Compiled to EVM bytecode

### Solidity in This Project

The marketplace contract (`Marketplace.sol`) demonstrates:
- State variables and mappings
- Function modifiers (access control)
- Event emission for off-chain indexing
- Inheritance from OpenZeppelin libraries

---

# Chapter 5: Decentralised Applications (dApps)

## 5.1 What is a dApp?

A **decentralised application (dApp)** is an application where:
- **Backend logic** runs on a blockchain (smart contracts)
- **Data** is stored on decentralised networks
- **Authentication** uses cryptographic wallets, not passwords

### dApp vs Traditional Web Application

| Aspect | Traditional Web App | dApp |
|--------|---------------------|------|
| **Backend** | Centralised servers | Smart contracts on blockchain |
| **Database** | SQL/NoSQL (single source) | Blockchain (replicated globally) |
| **Authentication** | Username/password | Wallet signature |
| **Data Ownership** | Company owns user data | Users own their data |
| **Downtime** | Server failure = outage | Contract always available |
| **Trust Model** | Trust the company | Trust the code |

> **📊 SUGGESTED GRAPHIC: dApp Architecture vs Traditional Architecture**
> 
> Side-by-side comparison showing:
> - Traditional: Browser → Server → Database
> - dApp: Browser → Wallet → Blockchain → IPFS

## 5.2 Components of a dApp

### 1. Smart Contracts (Backend)

The on-chain code that enforces business rules. In this project:
- `Marketplace.sol` handles listings, purchases, auctions, escrow

### 2. Frontend (User Interface)

A web application that interacts with the blockchain. In this project:
- Next.js 14 with React
- Communicates with contracts via ethers.js

### 3. Wallet Integration

Connects users to the blockchain. In this project:
- MetaMask browser extension
- Signs transactions and manages identity

### 4. Decentralised Storage

Stores large files off-chain. In this project:
- IPFS for images and metadata
- Pinata for reliable pinning

> **📊 SUGGESTED GRAPHIC: dApp Component Interaction**
> 
> Show the flow: User → Frontend → MetaMask → Ethereum → IPFS
> Use the container diagram from `ARCHITECTURE.md`

## 5.3 Advantages of dApps

| Advantage | Explanation |
|-----------|-------------|
| **Censorship Resistance** | No single party can shut down the app |
| **Transparency** | All transactions publicly auditable |
| **User Sovereignty** | Users control their assets and data |
| **Reduced Counterparty Risk** | Smart contracts execute automatically |
| **Global Access** | Anyone with internet can participate |

## 5.4 Limitations and Challenges

| Challenge | Explanation |
|-----------|-------------|
| **Scalability** | Limited transactions per second |
| **User Experience** | Wallet management, gas fees, confirmations |
| **Immutability** | Bugs cannot be easily patched |
| **Cost** | Every operation costs gas |
| **Finality Time** | Transactions take seconds to minutes |

---

# Chapter 6: Decentralised Storage and IPFS

## 6.1 The Storage Problem

Storing large files (images, documents) directly on blockchain is prohibitively expensive. Ethereum storage costs approximately $20,000 per megabyte at typical gas prices.

**Solution**: Store files on decentralised storage networks; store only the reference (hash) on-chain.

## 6.2 What is IPFS?

The **InterPlanetary File System (IPFS)** is a peer-to-peer network for storing and sharing files using **content addressing**.

### Content Addressing vs Location Addressing

| Type | Example | Behaviour |
|------|---------|-----------|
| **Location** | `https://example.com/image.jpg` | Points to where file is stored |
| **Content** | `ipfs://bafkrei...` | Points to what the file is |

With content addressing:
- The address is derived from the file's cryptographic hash
- Same content always produces the same address
- Any change to content produces a different address
- Content can be verified by recomputing the hash

> **📊 SUGGESTED GRAPHIC: Content Addressing Diagram**
> 
> Show: File → Hash Function → CID (Content Identifier)
> Illustrate that same file on different nodes has same CID

## 6.3 IPFS in This Project

| Component | Storage Location |
|-----------|------------------|
| Listing images | IPFS (via Pinata) |
| Metadata JSON | IPFS (via Pinata) |
| Metadata URI | On-chain (smart contract) |

### Metadata Structure

```json
{
  "name": "Vintage Camera",
  "description": "A classic 35mm film camera...",
  "image": "ipfs://bafkrei...",
  "category": "electronics",
  "createdAt": "2026-01-27T10:30:00.000Z"
}
```

## 6.4 Pinning Services

IPFS nodes only keep content they're interested in. To ensure availability, content must be **pinned**—explicitly marked for permanent storage.

**Pinata** is a pinning service that:
- Stores content reliably on IPFS
- Provides dedicated gateways
- Offers API for programmatic uploads

---

# Chapter 7: Wallet-Based Authentication

## 7.1 How Traditional Authentication Works

Traditional web applications authenticate users with:
1. User creates account with email/password
2. Server stores password hash
3. User logs in by proving knowledge of password
4. Server issues session token

**Problems**:
- Passwords can be stolen, phished, or guessed
- Users must trust the server to protect credentials
- Company controls account access (can ban, lock out)

## 7.2 How Wallet Authentication Works

Blockchain applications use **cryptographic authentication**:
1. User generates a private/public key pair (wallet)
2. Public key derives the user's address (identity)
3. User proves ownership by signing messages
4. No password stored anywhere

### The Signing Process

```
User Action           MetaMask              Blockchain
     │                   │                      │
     │ Click "Connect"   │                      │
     │──────────────────►│                      │
     │                   │ Request signature    │
     │◄──────────────────│                      │
     │ Approve in popup  │                      │
     │──────────────────►│                      │
     │                   │ Sign with private key│
     │                   │ Return signature     │
     │                   │─────────────────────►│
     │                   │                      │ Verify signature
     │                   │                      │ matches address
```

> **📊 SUGGESTED GRAPHIC: Wallet Authentication Flow**
> 
> Sequence diagram showing the wallet connection and transaction signing process

## 7.3 MetaMask

**MetaMask** is the most popular Ethereum wallet, available as a browser extension and mobile app.

### Features

| Feature | Description |
|---------|-------------|
| Key Management | Securely stores private keys |
| Transaction Signing | Signs transactions before broadcast |
| Network Switching | Connect to different Ethereum networks |
| dApp Connection | Standard interface for dApp integration |

---

# Chapter 8: The Rise and Fall of Blockchain Technology

## 8.1 The Hype Cycle

Blockchain technology has followed a classic hype cycle:

```
                          Peak of Inflated
                          Expectations (2017)
                               /\
                              /  \
                             /    \
                            /      \
    Innovation            /        \  Trough of
    Trigger (2008)       /          \ Disillusionment
           \            /            \ (2018-2019)
            \          /              \
             \________/                \__________ Slope of
                                                   Enlightenment
                                                   (2020-present)
```

## 8.2 What Went Wrong (2017–2019)

### ICO Mania

- Over $20 billion raised through Initial Coin Offerings
- Many projects had no viable product
- Regulatory absence enabled fraud
- Retail investors suffered significant losses

### Scalability Crisis

- Ethereum congested during CryptoKitties (2017)
- Transaction fees became prohibitive
- User experience suffered

### Security Failures

- The DAO hack ($60 million, 2016)
- Parity wallet freeze ($280 million, 2017)
- Numerous exchange hacks

## 8.3 What Survived and Why

Despite the crash, certain applications demonstrated real value:

| Category | Example | Value Proposition |
|----------|---------|-------------------|
| Stablecoins | USDC, DAI | Dollar-pegged digital currency |
| DeFi | Uniswap, Aave | Permissionless financial services |
| NFTs | Art, gaming | Provable digital ownership |
| Enterprise | Supply chain tracking | Transparent, auditable records |

## 8.4 The Current State (2024–2026)

### Positive Developments

- Ethereum's transition to Proof of Stake reduced energy consumption by ~99%
- Layer 2 solutions (Arbitrum, Optimism) dramatically reduced costs
- Institutional adoption increased (ETFs, corporate treasuries)
- Regulatory clarity emerging in many jurisdictions

### Ongoing Challenges

- User experience still complex for non-technical users
- Scams and rug pulls continue to harm reputation
- Regulatory uncertainty in some regions
- Environmental concerns (though mitigated by PoS)

> **📊 SUGGESTED GRAPHIC: Ethereum Transaction Costs Over Time**
> 
> Line graph showing gas prices from 2020-2026, highlighting L2 adoption impact

---

# Chapter 9: Competitor Analysis

## 9.1 Centralised Marketplace Competitors

| Platform | Model | Fees | Key Differences |
|----------|-------|------|-----------------|
| **eBay** | Centralised | 10-15% | Established trust, but high fees, account risk |
| **Amazon** | Centralised | 15-45% | Massive reach, but sellers have no control |
| **Etsy** | Centralised | 6.5% + fees | Niche focus, but still centralised control |
| **Facebook Marketplace** | Centralised | 5% | Social integration, but data harvesting |

### Problems with Centralised Marketplaces

1. **Platform risk**: Account can be banned without recourse
2. **High fees**: Platforms extract significant value
3. **Data ownership**: Platform owns transaction data
4. **Geographic restrictions**: Many exclude certain countries

## 9.2 Decentralised Marketplace Competitors

| Platform | Blockchain | Status | Key Features |
|----------|------------|--------|--------------|
| **OpenSea** | Ethereum/Polygon | Active | NFT focus, large market |
| **Rarible** | Ethereum | Active | NFT marketplace with governance token |
| **Origin Protocol** | Ethereum | Active | General marketplace protocol |
| **Particl** | Own chain | Active | Privacy-focused marketplace |

### Gaps in Existing dApp Marketplaces

| Gap | Explanation |
|-----|-------------|
| **Physical goods focus** | Most dApp marketplaces focus on digital assets (NFTs) |
| **Escrow integration** | Few provide built-in buyer protection |
| **User experience** | Many assume crypto-native users |
| **Auction support** | Limited time-based auction functionality |

## 9.3 How This Project Differs

| Feature | Existing Solutions | This Project |
|---------|-------------------|--------------|
| **Focus** | Primarily NFTs | Physical and digital goods |
| **Escrow** | Often absent | Built-in 14-day buyer protection |
| **Sale Types** | Usually fixed-price only | Fixed-price + English auctions |
| **Fees** | Variable, often high | Transparent 2.5% |
| **Educational Value** | Production focus | Documented learning resource |

---

# Chapter 10: Gaps in the Literature

## 10.1 Identified Gaps

### 1. Practical dApp Development Resources

**Gap**: Most academic literature focuses on blockchain theory rather than practical implementation guidance.

**This Project Addresses**: Provides comprehensive documentation of a working dApp with code examples, architecture decisions, and deployment procedures.

### 2. Physical Goods Marketplaces

**Gap**: Research predominantly covers NFT and digital asset marketplaces; limited literature on decentralised physical goods trading.

**This Project Addresses**: Implements escrow patterns suitable for physical goods with delivery confirmation mechanisms.

### 3. User Experience Studies

**Gap**: Few studies examine the UX challenges specific to dApp marketplaces from a practical perspective.

**This Project Documents**: Real-world UX challenges encountered during development (wallet connection, transaction confirmations, error handling).

### 4. Comparative Architecture Analysis

**Gap**: Limited side-by-side comparisons of dApp architecture versus traditional web application architecture with concrete examples.

**This Project Provides**: Detailed architecture documentation comparing the two approaches with the same use case (marketplace).

## 10.2 Areas for Future Research

| Area | Research Question |
|------|-------------------|
| **Dispute Resolution** | How can smart contracts handle subjective disputes (wrong item delivered)? |
| **Reputation Systems** | Can decentralised reputation be resistant to manipulation? |
| **Privacy** | How to balance transparency with user privacy needs? |
| **Legal Frameworks** | What regulatory structures support dApp marketplaces? |

---

# Chapter 11: Conclusion

## 11.1 Summary of Findings

This literature review has examined the technologies underpinning decentralised marketplace applications:

1. **Blockchain technology** provides an immutable, transparent foundation for trustless transactions
2. **Ethereum and smart contracts** enable complex business logic to execute without intermediaries
3. **IPFS** solves the storage problem by providing content-addressed decentralised file storage
4. **Wallet-based authentication** eliminates password vulnerabilities and gives users sovereignty
5. **dApp architecture** differs fundamentally from traditional web applications in trust model and data ownership

## 11.2 Implications for the Project

The reviewed technologies directly inform the project's architecture:

| Technology | Project Implementation |
|------------|----------------------|
| Ethereum | Marketplace.sol deployed on Sepolia testnet |
| Smart Contracts | Escrow, auctions, fee management |
| IPFS | Image and metadata storage via Pinata |
| Wallet Auth | MetaMask integration via ethers.js |

## 11.3 The Future of dApps

Despite the volatility and challenges, decentralised applications continue to mature. Key trends suggest:

- **Layer 2 scaling** will make dApps economically viable for everyday transactions
- **Account abstraction** will simplify user experience
- **Regulatory clarity** will enable mainstream adoption
- **Hybrid architectures** will combine centralised efficiency with decentralised trust guarantees

The project demonstrates that building a functional dApp marketplace is achievable with current technology, while also highlighting areas where further development is needed.

---

# References

## Foundational Papers

1. Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. Available at: https://bitcoin.org/bitcoin.pdf

2. Buterin, V. (2014). *Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform*. Available at: https://ethereum.org/whitepaper

3. Wood, G. (2014). *Ethereum: A Secure Decentralised Generalised Transaction Ledger (Yellow Paper)*. Available at: https://ethereum.github.io/yellowpaper/paper.pdf

4. Benet, J. (2014). *IPFS - Content Addressed, Versioned, P2P File System*. Available at: https://ipfs.io/ipfs/QmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X1o4k7zrJa3LX/ipfs.draft3.pdf

## Security Research

5. Atzei, N., Bartoletti, M., & Cimoli, T. (2017). *A Survey of Attacks on Ethereum Smart Contracts*. In Principles of Security and Trust (POST). Springer.

6. Luu, L., Chu, D. H., Olickel, H., Saxena, P., & Hobor, A. (2016). *Making Smart Contracts Smarter*. In Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security.

## Books

7. Antonopoulos, A. M. (2017). *Mastering Bitcoin: Programming the Open Blockchain* (2nd ed.). O'Reilly Media.

8. Antonopoulos, A. M., & Wood, G. (2018). *Mastering Ethereum: Building Smart Contracts and DApps*. O'Reilly Media.

## Official Documentation

9. Ethereum Foundation. *Ethereum Developer Documentation*. https://ethereum.org/en/developers/docs/

10. Solidity Team. *Solidity Documentation*. https://docs.soliditylang.org/

11. Protocol Labs. *IPFS Documentation*. https://docs.ipfs.tech/

12. OpenZeppelin. *Contracts Documentation*. https://docs.openzeppelin.com/contracts/

13. ethers.js. *Documentation v6*. https://docs.ethers.org/v6/

## Standards

14. EIP-20: Token Standard. https://eips.ethereum.org/EIPS/eip-20

15. EIP-721: Non-Fungible Token Standard. https://eips.ethereum.org/EIPS/eip-721

16. EIP-1193: Ethereum Provider JavaScript API. https://eips.ethereum.org/EIPS/eip-1193

---

# Glossary

| Term | Definition |
|------|------------|
| **Address** | A 42-character hexadecimal identifier for an Ethereum account |
| **ABI** | Application Binary Interface; describes how to interact with a contract |
| **Block** | A collection of transactions bundled together with metadata |
| **Blockchain** | A distributed, immutable ledger of transactions |
| **CID** | Content Identifier; IPFS address derived from content hash |
| **Consensus** | The mechanism by which network participants agree on valid state |
| **dApp** | Decentralised Application; application with blockchain backend |
| **EOA** | Externally Owned Account; a wallet controlled by a private key |
| **Escrow** | A pattern where funds are held until conditions are met |
| **EVM** | Ethereum Virtual Machine; the runtime for smart contracts |
| **Gas** | Unit measuring computational effort on Ethereum |
| **IPFS** | InterPlanetary File System; peer-to-peer file storage network |
| **MetaMask** | Popular browser wallet for Ethereum |
| **Nonce** | Counter tracking transactions from an account |
| **Pinning** | Marking IPFS content for permanent storage |
| **Private Key** | Secret number that proves account ownership |
| **Smart Contract** | Self-executing code deployed on blockchain |
| **Solidity** | Programming language for Ethereum smart contracts |
| **Transaction** | A signed instruction to the blockchain |
| **Wallet** | Software that manages private keys and blockchain interaction |
| **Wei** | Smallest unit of ETH (10⁻¹⁸ ETH) |

---

# Further Reading

## Tutorials and Courses

- **CryptoZombies** — Interactive Solidity tutorial: https://cryptozombies.io/
- **Ethereum.org Tutorials** — Official learning resources: https://ethereum.org/en/developers/tutorials/
- **Hardhat Tutorial** — Development environment guide: https://hardhat.org/tutorial

## Community Resources

- **Ethereum Stack Exchange** — Q&A forum: https://ethereum.stackexchange.com/
- **r/ethdev** — Reddit developer community: https://reddit.com/r/ethdev
- **Ethereum Discord** — Real-time discussion: https://discord.gg/ethereum-builders

## News and Updates

- **Week in Ethereum News** — Weekly newsletter: https://weekinethereumnews.com/
- **The Defiant** — DeFi news: https://thedefiant.io/
- **Bankless** — Crypto media: https://bankless.com/

## Security Resources

- **Consensys Diligence** — Smart contract security: https://consensys.io/diligence/
- **OpenZeppelin Blog** — Security best practices: https://blog.openzeppelin.com/
- **Rekt News** — Hack post-mortems: https://rekt.news/

## Related Project Documentation

- [System Architecture](02-system-architecture.md) — Technical architecture details
- [Data & Storage](03-data-and-storage.md) — Data model implementation
- [API & Contracts](04-api-and-contracts.md) — Smart contract reference
- [Security](../SECURITY.md) — Project threat model

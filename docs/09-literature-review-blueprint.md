# Literature Review

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

This literature review provides an overview of blockchain technology and decentralised applications (dApps). It examines:

- What blockchain technology is and how it works
- The history and evolution of blockchain
- How decentralised applications differ from traditional web applications
- The key technologies used in dApp development

The review provides context for understanding modern dApp architecture and the technologies commonly employed in building decentralised systems.

## 1.2 Scope

This review focuses on technologies relevant to decentralised marketplace development, including:

- Blockchain and distributed ledger technology
- Smart contracts (with focus on Ethereum)
- Decentralised storage (IPFS)
- Wallet-based authentication

---

# Chapter 2: Methodology and Search Strategy

## 2.1 Web Search and Search Terms

General research was conducted using:

- **Google Scholar** — Academic papers and citations
- **Google** — Technical documentation and tutorials
- **Medium / Dev.to** — Developer articles and experiences
- **GitHub** — Open-source code and documentation

### Search Terms Used

- "blockchain technology overview"
- "Ethereum smart contracts introduction"
- "dApp vs traditional web application"
- "IPFS decentralised storage"
- "Web3 authentication"
- "history of cryptocurrency"

## 2.2 Academic Journals

Peer-reviewed academic literature was accessed using **ATU Sligo student credentials** through the institution's library portal. This provided authenticated access to:

| Database | Content Type |
|----------|--------------|
| **IEEE Xplore** | Conference papers, technical standards |
| **ACM Digital Library** | Computing research papers |
| **ScienceDirect** | Information systems research |
| **ResearchGate** | Preprints and published papers |

Access was authenticated via the ATU Sligo single sign-on (SSO) system, which grants students access to subscribed academic databases.

## 2.3 AI Tools

AI assistants were used to aid understanding and research synthesis:

- **Claude (Anthropic)** — Concept explanations and code assistance
- **ChatGPT (OpenAI)** — Research synthesis

*Note: AI tools assisted with understanding; all claims are supported by cited sources.*

---

# Chapter 3: Blockchain Technology Overview

## 3.1 What is Blockchain?

A **blockchain** is a distributed digital ledger that records transactions across many computers. Key characteristics include:

| Characteristic | Description |
|----------------|-------------|
| **Distributed** | Copies stored on thousands of computers worldwide |
| **Immutable** | Once recorded, data cannot be changed |
| **Transparent** | All transactions are publicly visible |
| **Decentralised** | No single entity controls the network |

> **📊 SUGGESTED GRAPHIC: Simple blockchain diagram showing blocks linked together**

## 3.2 How It Works (Simplified)

1. A user initiates a transaction
2. The transaction is broadcast to the network
3. Network participants validate the transaction
4. Valid transactions are grouped into a "block"
5. The block is added to the existing chain
6. The transaction is complete and permanent

## 3.3 Key Concepts

**Consensus Mechanisms** — How the network agrees on valid transactions:
- *Proof of Work*: Computers solve puzzles to validate (Bitcoin)
- *Proof of Stake*: Validators stake cryptocurrency as collateral (Ethereum)

**Cryptography** — Mathematical techniques that secure the network:
- Transactions are signed with private keys
- Data integrity verified through hashing

**Smart Contracts** — Self-executing code stored on the blockchain that runs automatically when conditions are met.

---

# Chapter 4: A Brief History of Blockchain

## 4.1 Timeline

| Year | Milestone |
|------|-----------|
| **2008** | Satoshi Nakamoto publishes the Bitcoin whitepaper |
| **2009** | Bitcoin network launches |
| **2013** | Vitalik Buterin proposes Ethereum |
| **2015** | Ethereum launches with smart contract support |
| **2017** | ICO boom; cryptocurrency goes mainstream |
| **2018** | Market crash; "crypto winter" begins |
| **2020** | DeFi (Decentralised Finance) gains traction |
| **2021** | NFT explosion; mainstream media coverage |
| **2022** | Ethereum switches to Proof of Stake |
| **2023–Present** | Focus on scalability and real-world utility |

> **📊 SUGGESTED GRAPHIC: Timeline visualisation of key blockchain milestones**

## 4.2 The Rise and Fall Pattern

Blockchain technology has followed a classic hype cycle:

**The Hype (2017)**: Massive speculation, ICOs raising billions, promises of disrupting every industry.

**The Crash (2018–2019)**: Bitcoin fell 80%, many projects failed, public interest waned.

**The Recovery (2020–Present)**: Focus shifted from speculation to building useful applications. DeFi and NFTs demonstrated real use cases. Institutional adoption increased.

**Current State**: The technology is maturing. Layer 2 solutions address scalability. Regulatory frameworks emerging. Less hype, more building.

---

# Chapter 5: Technologies Used in dApp Development

## 5.1 Ethereum and Smart Contracts

**Ethereum** is a blockchain platform that allows developers to build applications on top of it. Unlike Bitcoin (primarily for payments), Ethereum supports programmable "smart contracts."

**Smart Contracts** are programs stored on the blockchain that execute automatically. They:
- Cannot be changed once deployed
- Execute exactly as programmed
- Are publicly verifiable

**Solidity** is the main programming language for writing Ethereum smart contracts.

## 5.2 Decentralised Storage (IPFS)

Storing files directly on blockchain is expensive. **IPFS (InterPlanetary File System)** solves this:

- Files stored across a peer-to-peer network
- Each file gets a unique address based on its content (not location)
- Content cannot be tampered with (any change = different address)

**Pinning services** (like Pinata) ensure files remain available on the network.

## 5.3 Wallets and Authentication

Traditional apps use usernames and passwords. dApps use **cryptocurrency wallets**:

- Users have a **private key** (secret) and **public address** (identity)
- Authentication happens by signing messages with the private key
- No passwords stored anywhere
- **MetaMask** is the most popular browser wallet

## 5.4 Frontend Technologies

dApp frontends are typically built with standard web technologies:
- React, Next.js, or similar frameworks
- **ethers.js** or **web3.js** libraries to connect to blockchain
- Standard HTML/CSS/JavaScript

---

# Chapter 6: dApps vs Traditional Web Applications

## 6.1 Architecture Comparison

> **📊 SUGGESTED GRAPHIC: Side-by-side architecture diagrams**
> 
> **Traditional**: User → Browser → Server → Database
> 
> **dApp**: User → Browser → Wallet → Blockchain + IPFS

## 6.2 Key Differences

| Aspect | Traditional Web App | Decentralised App (dApp) |
|--------|---------------------|--------------------------|
| **Backend** | Company servers | Blockchain (smart contracts) |
| **Database** | Centralised (MySQL, MongoDB) | Distributed ledger |
| **Authentication** | Username/password | Wallet signature |
| **Data Ownership** | Company owns data | Users own their data |
| **Downtime** | Server failure = outage | Always available |
| **Control** | Company can change rules | Rules fixed in code |
| **Trust** | Trust the company | Trust the code |
| **Costs** | Company pays for servers | Users pay per transaction (gas) |

## 6.3 When to Use Each

**Traditional apps are better when:**
- Speed is critical (blockchain is slower)
- Data needs to be private
- Costs must be predictable
- Users are non-technical

**dApps are better when:**
- Trust and transparency are essential
- Censorship resistance is needed
- Users want to own their data
- Intermediaries should be eliminated

## 6.4 Hybrid Approaches

Many modern applications use a mix:
- Critical financial logic on blockchain
- User interface on traditional servers
- Large files on IPFS
- Real-time data on traditional databases

---

# Chapter 7: Competitor Analysis

## 7.1 Centralised Marketplaces

| Platform | Fees | Issues |
|----------|------|--------|
| eBay | 10-15% | High fees, account bans, platform control |
| Amazon | 15-45% | Seller restrictions, data harvesting |
| Facebook Marketplace | 5% | Privacy concerns, limited features |

**Common problems**: High fees, platform can ban users, company controls all data, geographic restrictions.

## 7.2 Decentralised Alternatives

| Platform | Focus | Status |
|----------|-------|--------|
| OpenSea | NFTs | Largest NFT marketplace |
| Rarible | NFTs | Community-governed |
| Origin Protocol | General commerce | Protocol for building marketplaces |

**Common gaps**: Most focus on digital assets (NFTs), limited physical goods support, complex user experience.

---

# Chapter 8: Gaps in the Literature

## 8.1 Identified Gaps

1. **Practical Implementation Guides**: Most literature is theoretical; few practical guides for building complete dApps exist.

2. **Physical Goods Focus**: Research predominantly covers NFTs and digital assets, not physical goods marketplaces.

3. **User Experience Studies**: Limited research on making dApps accessible to non-technical users.

4. **Comparative Studies**: Few direct comparisons between dApp and traditional architectures for the same use case.

## 8.2 Future Research Areas

- Dispute resolution in decentralised systems
- Decentralised reputation systems
- Balancing transparency with privacy
- Regulatory frameworks for dApps

---

# Chapter 9: Conclusion

## 9.1 Summary

This literature review has examined blockchain technology and decentralised applications:

- **Blockchain** provides a transparent, immutable foundation for trustless systems
- **Smart contracts** enable automated, verifiable business logic
- **IPFS** solves the storage problem for decentralised applications
- **Wallet authentication** replaces passwords with cryptographic signatures
- **dApps differ fundamentally** from traditional apps in trust model and data ownership

## 9.2 Current State of the Technology

Blockchain technology has moved past the initial hype phase. Current developments focus on:
- Scalability solutions (Layer 2)
- Improved user experience
- Regulatory compliance
- Real-world utility over speculation

The technology is maturing, with practical applications emerging in finance, supply chain, identity, and commerce.

---

# References

1. Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*. https://bitcoin.org/bitcoin.pdf

2. Buterin, V. (2014). *Ethereum White Paper*. https://ethereum.org/whitepaper

3. Benet, J. (2014). *IPFS - Content Addressed, Versioned, P2P File System*. https://ipfs.io/

4. Antonopoulos, A. M., & Wood, G. (2018). *Mastering Ethereum*. O'Reilly Media.

5. Ethereum Foundation. *Ethereum Developer Documentation*. https://ethereum.org/developers/

6. Solidity Documentation. https://docs.soliditylang.org/

7. IPFS Documentation. https://docs.ipfs.tech/

8. MetaMask Documentation. https://docs.metamask.io/

---

# Glossary

| Term | Definition |
|------|------------|
| **Blockchain** | A distributed, immutable ledger of transactions |
| **Smart Contract** | Self-executing code deployed on a blockchain |
| **dApp** | Decentralised application with blockchain backend |
| **Ethereum** | A blockchain platform supporting smart contracts |
| **IPFS** | Peer-to-peer file storage network |
| **Wallet** | Software managing cryptocurrency keys and transactions |
| **Gas** | Fee paid for blockchain transactions |
| **MetaMask** | Popular browser wallet for Ethereum |
| **Solidity** | Programming language for Ethereum contracts |
| **CID** | Content identifier used by IPFS |

---

# Further Reading

**Getting Started:**
- Ethereum.org — https://ethereum.org/learn/
- CryptoZombies (interactive tutorial) — https://cryptozombies.io/

**News & Updates:**
- Week in Ethereum News — https://weekinethereumnews.com/
- The Defiant — https://thedefiant.io/

**Technical Documentation:**
- Hardhat (development tool) — https://hardhat.org/docs
- ethers.js — https://docs.ethers.org/
- OpenZeppelin (security) — https://docs.openzeppelin.com/

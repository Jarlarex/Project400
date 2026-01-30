# Project 400 Presentation Outline

**Student**: Iarfhlaith Feeney (S00238682)  
**Project**: DecentraMarket — Decentralised Marketplace dApp

---

## Slide 1: Title Slide

- **DecentraMarket**
- Decentralised Marketplace dApp
- Iarfhlaith Feeney (S00238682)
- Project 400 — ATU Sligo
- January 2026

---

## Slide 2: Overview of Project

### What is it?
- A peer-to-peer marketplace built on Ethereum blockchain
- Users can buy and sell items without a middleman
- Smart contracts handle all transactions

### Problem Being Solved
- Traditional marketplaces (eBay, Facebook) have:
  - High fees (10-20%)
  - Centralised control (can ban users, freeze funds)
  - Trust issues (you trust the platform)
  - Data ownership problems

### My Solution
- Trustless transactions via smart contracts
- Lower fees (2.5%)
- Buyer protection through escrow
- No central authority

> **Visual**: Side-by-side comparison — Traditional vs Decentralised

---

## Slide 3: User Requirements

### User Roles
| Role | What They Do |
|------|--------------|
| **Seller** | Lists items, ships goods, receives payment |
| **Buyer** | Browses, purchases, confirms delivery |
| **Platform Owner** | Sets fees, withdraws platform fees |

### Key Features Required
1. **Wallet Connection** — MetaMask integration
2. **Create Listings** — Fixed-price or auction
3. **Purchase with Escrow** — 14-day buyer protection
4. **Auction Bidding** — Competitive bidding system
5. **User Profile** — Track listings and sales

### Acceptance Criteria (Sample)
- ✅ User can connect wallet
- ✅ User can create listing with image
- ✅ Buyer can purchase with escrow
- ✅ Seller receives payment on delivery confirmation

> **Visual**: Simple user flow diagram

---

## Slide 4: Tech Stack / Architecture

### Smart Contract Layer
| Technology | Purpose |
|------------|---------|
| **Solidity** | Smart contract language |
| **Hardhat** | Development + testing framework |
| **OpenZeppelin** | Security libraries |
| **ethers.js** | Blockchain interaction |

### Frontend Layer
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework |
| **TypeScript** | Type safety |
| **TailwindCSS** | Styling |

### Storage Layer
| Technology | Purpose |
|------------|---------|
| **IPFS** | Decentralised file storage |
| **Pinata** | IPFS pinning service |

### Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Next.js   │────▶│   Pinata    │
│  + MetaMask │     │   Frontend  │     │    IPFS     │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       │ (Signs transactions)
       ▼
┌─────────────────────────────────────────────────────┐
│              Ethereum (Sepolia Testnet)              │
│  ┌───────────────────────────────────────────────┐  │
│  │           Marketplace.sol Contract            │  │
│  │  • Listings    • Escrow    • Auctions        │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

> **Visual**: Architecture diagram (cleaner version of above)

---

## Slide 5: Research / Learning

### Technologies I Had to Learn
| Topic | Resources Used |
|-------|----------------|
| **Solidity** | CryptoZombies, Solidity docs |
| **Hardhat** | Official docs, tutorials |
| **IPFS** | Protocol docs, Pinata guides |
| **ethers.js** | Documentation, examples |
| **Smart Contract Security** | OpenZeppelin, ConsenSys best practices |

### Key Concepts Learned
- How blockchain consensus works
- Smart contract design patterns
- Escrow implementation
- Decentralised storage (content addressing)
- Wallet authentication vs traditional auth

### Challenges Faced
1. **IPFS Gateway Issues** — SSL certificate problems on Windows
   - *Solution*: Implemented multi-gateway fallback
2. **Smart Contract Testing** — Complex state management
   - *Solution*: Comprehensive test suite (29+ tests)
3. **Escrow Logic** — Getting the timing right
   - *Solution*: 14-day deadline with seller release option

> **Visual**: Learning journey timeline or mind map

---

## Slide 6: Project Management

### Methodology
- Agile-ish approach
- Weekly iterations
- Git for version control

### Tools Used
| Tool | Purpose |
|------|---------|
| **GitHub** | Code repository, version control |
| **Cursor** | AI-assisted development |
| **Hardhat** | Testing and deployment |

### Timeline (Approximate)
| Phase | Timeframe | Activities |
|-------|-----------|------------|
| Research | Weeks 1-3 | Blockchain fundamentals, tech selection |
| Smart Contract | Weeks 4-8 | Contract development, testing |
| Frontend | Weeks 9-12 | Next.js app, wallet integration |
| Integration | Weeks 13-15 | IPFS, escrow, polish |
| Documentation | Weeks 16+ | Docs, presentation |

### Repository Stats
- Commits: X
- Test coverage: 29+ tests passing
- Documentation: 10 docs

> **Visual**: Gantt chart or timeline

---

## Slide 7: Work To Date

### ✅ Completed Features

**Smart Contract**
- ✅ Fixed-price listings
- ✅ English auctions (1hr–30 days)
- ✅ 14-day escrow system
- ✅ Platform fee system (2.5%)
- ✅ 29+ tests passing

**Frontend**
- ✅ Wallet connection (MetaMask)
- ✅ Create listing page
- ✅ Explore/browse listings
- ✅ Listing detail page
- ✅ User profile page
- ✅ Escrow notifications for sellers

**Infrastructure**
- ✅ Deployed to Sepolia testnet
- ✅ Contract verified on Etherscan
- ✅ IPFS integration with Pinata
- ✅ Multi-gateway fallback

### Live Demo
- Contract: `0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b`
- [View on Etherscan](https://sepolia.etherscan.io/address/0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b)

> **Visual**: Screenshots of working app

---

## Slide 8: Future Work

### Short Term (If More Time)
| Feature | Description |
|---------|-------------|
| **Search & Filters** | Filter by price, category, status |
| **Categories** | Organise listings by type |
| **Dispute Resolution** | On-chain arbitration system |
| **Notifications** | Email/push for escrow events |

### Long Term (Production)
| Feature | Description |
|---------|-------------|
| **Security Audit** | Professional contract audit |
| **Mainnet Deployment** | Deploy to Ethereum mainnet |
| **Multi-chain** | Support Polygon, Arbitrum |
| **Reputation System** | On-chain seller/buyer ratings |
| **Mobile App** | React Native version |

### Beyond Scope (Deliberate Exclusions)
- Fiat currency integration
- NFT marketplace features
- KYC/AML compliance

> **Visual**: Roadmap or feature priority matrix

---

## Slide 9: Demo (Optional)

### Live Walkthrough
1. Connect wallet
2. Create a listing
3. View listing on explore page
4. Initiate purchase
5. Show escrow on seller profile
6. Confirm delivery

---

## Slide 10: Questions?

- **GitHub**: github.com/Jarlarex/Project400
- **Contract**: 0x7db2fdaD...Aba339b (Sepolia)
- **Contact**: S00238682@atu.ie

---

# Speaker Notes

## Slide 2 Notes
- Emphasise the *problem* before the solution
- Mention real examples (eBay fees, account bans)
- Keep it relatable — most people have used online marketplaces

## Slide 3 Notes
- Don't read the whole requirements table
- Focus on 2-3 key requirements
- Mention escrow as the key differentiator

## Slide 4 Notes
- Don't go too deep on each technology
- Explain *why* each was chosen
- The diagram is the key visual — talk through it

## Slide 5 Notes
- Be honest about challenges
- Show learning journey, not just end result
- Mention specific resources that helped

## Slide 6 Notes
- Don't need to be perfectly Agile
- Show you had a plan and adapted
- Git commit history shows progress

## Slide 7 Notes
- This is your "show off" slide
- Have screenshots ready
- Be prepared for live demo questions

## Slide 8 Notes
- Shows you understand limitations
- Demonstrates forward thinking
- Mention why certain things were out of scope

---

# Timing Guide

| Slide | Time (approx) |
|-------|---------------|
| 1. Title | 30 sec |
| 2. Overview | 2 min |
| 3. Requirements | 2 min |
| 4. Tech Stack | 2-3 min |
| 5. Research | 2 min |
| 6. Project Management | 1-2 min |
| 7. Work To Date | 2-3 min |
| 8. Future Work | 1-2 min |
| 9. Demo | 3-5 min |
| 10. Questions | As needed |

**Total**: ~15-20 minutes (adjust demo for time)

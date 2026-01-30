# Presentation Script Overview

**Duration**: 10 minutes  
**Style**: Conversational, expandable bullet points

---

## Slide 1: Title (15 seconds)

> "Hi, I'm Iarfhlaith Feeney. My project is DecentraMarket — a decentralised marketplace built on Ethereum."

---

## Slide 2: Overview (1.5 minutes)

### The Problem

> "Most of us have used eBay, Facebook Marketplace, or Amazon. They work, but they have issues."

- **High fees** — eBay takes 10-15%, Amazon even more
- **Centralised control** — they can ban your account, freeze your funds, change the rules whenever they want
- **Trust** — you're trusting a company to handle your money fairly

> "Basically, you're at the mercy of the platform."

### My Solution

> "DecentraMarket removes the middleman. Instead of trusting a company, you trust code."

- Smart contracts handle all transactions
- No central authority can interfere
- Built-in buyer protection through escrow
- Everything recorded on the blockchain — transparent and permanent

> "It's peer-to-peer trading where the rules are enforced by code, not a company."

---

## Slide 3: User Requirements (1 minute)

### Who Uses It

> "There are three main roles:"

- **Sellers** — list items, ship goods, get paid
- **Buyers** — browse, purchase, confirm delivery
- **Platform owner** — just oversees things, can't touch user funds

### Key Features

> "The main features I needed to build:"

- Wallet connection via MetaMask
- Create listings — either fixed price or auction
- **Escrow system** — this is the key one. Buyer's money is held for 14 days, giving them time to receive the item and confirm delivery

> "The escrow is what makes it trustless. Neither party can cheat the other."

---

## Slide 4: Tech Stack / Architecture (1.5 minutes)

### The Stack

> "Quick overview of the tech:"

**Smart Contracts:**
- Solidity — the language for Ethereum contracts
- Hardhat — testing and deployment
- OpenZeppelin — battle-tested security libraries

**Frontend:**
- Next.js with TypeScript — React framework
- TailwindCSS for styling

**Storage:**
- IPFS for images and metadata — decentralised storage
- Pinata to keep files available

### Architecture

> "Here's how it all connects:"

- User opens the app in their browser with MetaMask
- Frontend talks to IPFS for images/metadata
- When they make a transaction, MetaMask signs it
- Transaction goes to the smart contract on Ethereum
- Contract handles all the logic — listings, escrow, auctions

> "The key point: there's no traditional database. All the important data lives on the blockchain."

---

## Slide 5: Research / Learning (1 minute)

### What I Had to Learn

> "I came into this knowing JavaScript and React, but blockchain was new to me."

- **Solidity** — completely new language, different mental model
- **How blockchain works** — consensus, gas fees, transactions
- **Smart contract patterns** — escrow, reentrancy protection
- **IPFS** — content-addressed storage, completely different from normal file storage

### Challenges

> "A few things that tripped me up:"

1. **IPFS gateway issues** — SSL certificate problems on Windows. Had to implement fallback to multiple gateways
2. **Testing smart contracts** — state management is tricky when you can't just reset a database
3. **Escrow timing** — getting the deadlines and edge cases right

> "Most of my learning was through documentation, CryptoZombies for Solidity basics, and a lot of trial and error."

---

## Slide 6: Project Management (1 minute)

### Approach

> "I used a loose Agile approach — weekly iterations, adapting as I went."

- Git for version control
- GitHub for the repository
- Cursor as my IDE — AI-assisted development helped a lot

### Timeline

> "Roughly how it broke down:"

- **Weeks 1-3**: Research — understanding blockchain, choosing the stack
- **Weeks 4-8**: Smart contract development and testing
- **Weeks 9-12**: Frontend — building the Next.js app
- **Weeks 13-15**: Integration — connecting everything, IPFS, polish
- **Week 16+**: Documentation and this presentation

> "It wasn't perfectly linear — I went back and forth between contract and frontend as I learned more."

---

## Slide 7: Work To Date (1.5 minutes)

### What's Done

> "Here's what's actually working:"

**Smart Contract:**
- Fixed-price listings ✓
- English auctions with configurable duration ✓
- 14-day escrow system ✓
- Platform fees ✓
- 29 tests passing ✓

**Frontend:**
- Wallet connection ✓
- Create listing with image upload ✓
- Browse and view listings ✓
- Purchase flow with escrow ✓
- User profile showing your listings and escrow items ✓

**Deployed:**
- Live on Sepolia testnet
- Contract verified on Etherscan — you can read the code

> "It's a working proof of concept. You can create a listing, buy it, go through the escrow flow."

[Show screenshots here]

---

## Slide 8: Future Work (1 minute)

### If I Had More Time

> "There's plenty more that could be added:"

- **Search and filters** — right now you just browse everything
- **Categories** — organise by item type
- **Dispute resolution** — what happens if buyer and seller disagree?
- **Better notifications** — email or push when something happens in escrow

### For Production

> "If this were going to mainnet:"

- **Security audit** — absolutely essential, smart contracts handle real money
- **Multi-chain** — Polygon or Arbitrum for lower fees
- **Reputation system** — on-chain ratings for buyers and sellers

### Deliberate Exclusions

> "Some things I intentionally left out:"

- Fiat integration — adds regulatory complexity
- NFT features — wanted to focus on general marketplace
- Mobile app — web-first for this scope

---

## Slide 9: Questions (30 seconds)

> "That's DecentraMarket — a decentralised marketplace with smart contract escrow."

> "The code is on GitHub, the contract is live on Sepolia if you want to try it."

> "Any questions?"

---

# Quick Reference Card

Keep this handy during the presentation:

| If Asked About... | Key Points |
|-------------------|------------|
| **Why blockchain?** | Trustless, no middleman, transparent |
| **Why not just use eBay?** | Fees, control, censorship |
| **Is it secure?** | OpenZeppelin, ReentrancyGuard, tested |
| **Gas fees?** | Yes, users pay per transaction — tradeoff for decentralisation |
| **Why Sepolia not mainnet?** | Educational project, not audited for real money |
| **Hardest part?** | Probably IPFS integration / escrow edge cases |
| **What would you do differently?** | Start with more contract testing earlier |

---

# Delivery Tips

1. **Don't read slides** — glance at them, talk to the audience
2. **Slow down** — nervous = fast, take a breath
3. **It's okay to say "I don't know"** — better than making something up
4. **Have screenshots ready** — in case they want to see the app
5. **Know your contract address** — `0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b`

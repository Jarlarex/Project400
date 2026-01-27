# Glossary

## Purpose

Define technical terms used throughout the documentation and codebase.

## Scope

Covers blockchain, Ethereum, IPFS, and dApp-specific terminology.

## Audience

Anyone unfamiliar with Web3 concepts or needing quick reference.

---

## Blockchain Fundamentals

### Blockchain

A distributed ledger where data is stored in blocks linked together cryptographically. Once a block is added, it cannot be altered without changing all subsequent blocks, making it tamper-evident.

### Block

A collection of transactions bundled together with a timestamp, reference to the previous block (hash), and other metadata. On Ethereum, blocks are produced approximately every 12 seconds.

### Transaction (Tx)

A signed instruction from an account to the blockchain. Transactions can transfer ETH, call smart contract functions, or deploy new contracts.

### Gas

The unit measuring computational effort on Ethereum. Every operation costs gas, and users pay gas fees (in ETH) to incentivise validators to include their transactions.

### Gas Price

The amount of ETH per unit of gas a user is willing to pay. Higher gas prices result in faster transaction inclusion. Measured in Gwei (10⁻⁹ ETH).

### Consensus

The mechanism by which network participants agree on the current state. Ethereum uses Proof of Stake (PoS) where validators stake ETH to propose and attest to blocks.

---

## Ethereum Concepts

### Ethereum

A decentralised platform that runs smart contracts. Often called a "world computer" because any computation can be executed in a trustless manner.

### Ether (ETH)

The native cryptocurrency of Ethereum, used to pay for gas fees and as a store of value. Smallest unit is Wei (10⁻¹⁸ ETH).

### Wei

The smallest unit of ETH. 1 ETH = 10¹⁸ Wei. Contract functions often work with Wei values.

### Gwei

A commonly used unit for gas prices. 1 Gwei = 10⁹ Wei = 10⁻⁹ ETH.

### Smart Contract

Self-executing code deployed on Ethereum. Once deployed, the code is immutable and executes automatically when called, enforcing rules without intermediaries.

### EVM (Ethereum Virtual Machine)

The runtime environment for smart contracts. All Ethereum nodes run the same EVM, ensuring deterministic execution.

### Solidity

The most popular programming language for writing Ethereum smart contracts. Statically typed, supports inheritance, and compiles to EVM bytecode.

---

## Accounts and Wallets

### Account

An entity on Ethereum identified by an address. Can hold ETH balance and, for contract accounts, contain code.

### EOA (Externally Owned Account)

An account controlled by a private key, typically owned by a human. EOAs can initiate transactions. MetaMask creates EOAs.

### Contract Account

An account that contains smart contract code. Cannot initiate transactions but responds to calls from EOAs or other contracts.

### Address

A 42-character hexadecimal string (e.g., `0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b`) identifying an account on Ethereum. Derived from the public key.

### Private Key

A 256-bit secret number that proves ownership of an address and allows signing transactions. Must never be shared.

### Public Key

Derived from the private key using elliptic curve cryptography. The address is derived from the public key.

### Seed Phrase (Recovery Phrase)

A 12-24 word phrase that can regenerate all private keys in a wallet. Must be stored securely offline.

### Wallet

Software that manages private keys and interacts with the blockchain. Examples: MetaMask (browser extension), Ledger (hardware).

### MetaMask

A popular browser extension and mobile wallet for Ethereum. Manages accounts, signs transactions, and connects dApps to the blockchain.

---

## Transactions and State

### Nonce

A counter tracking how many transactions an account has sent. Prevents replay attacks and ensures transaction ordering.

### Signature

Cryptographic proof that the transaction was authorised by the private key holder. Uses ECDSA (Elliptic Curve Digital Signature Algorithm).

### State

The current data stored on the blockchain, including all account balances and smart contract storage. Modified by transactions.

### Transaction Receipt

A record returned after a transaction is mined, containing status (success/fail), gas used, and event logs.

### Event (Log)

Data emitted by smart contracts during execution. Events are stored in transaction receipts and can be indexed for efficient querying. Not accessible by contracts themselves.

---

## Smart Contract Patterns

### Reentrancy

A vulnerability where an external call allows the called contract to re-enter the calling function before it completes. Mitigated by the Checks-Effects-Interactions pattern or ReentrancyGuard.

### ReentrancyGuard

A modifier from OpenZeppelin that prevents a function from being called again before the first call completes.

### Ownable

An OpenZeppelin contract providing basic access control, where only the contract "owner" can call certain functions.

### Modifier

A Solidity construct that modifies function behaviour, typically for access control or validation. Example: `onlyOwner`, `nonReentrant`.

### Pull Pattern (vs Push)

A design pattern where recipients withdraw funds themselves (pull) rather than the contract sending to them (push). Prevents failures if a recipient reverts.

### Escrow

A pattern where funds are held by a smart contract until conditions are met. Provides trustless intermediation.

---

## IPFS and Storage

### IPFS (InterPlanetary File System)

A peer-to-peer network for storing and sharing files using content addressing. Files are identified by their cryptographic hash (CID), not their location.

### CID (Content Identifier)

A unique identifier derived from the content's hash. Any change to content produces a different CID. Format: `Qm...` (v0) or `bafy...` (v1).

### Pinning

Telling an IPFS node to keep content permanently available. Without pinning, content may be garbage-collected when storage is needed.

### Gateway

An HTTP server that retrieves IPFS content on behalf of browsers. Example: `https://ipfs.io/ipfs/Qm...`

### Pinata

A popular IPFS pinning service that provides reliable storage and dedicated gateways. Used in this project for uploads.

### Content Addressing

Identifying content by its hash rather than its location. Ensures content integrity—if the content changes, the address changes.

---

## dApp Terminology

### dApp (Decentralised Application)

An application where the backend logic runs on a decentralised network (blockchain) rather than centralised servers.

### Web3

A vision for a decentralised internet built on blockchain, where users own their data and identity. Also refers to libraries for blockchain interaction (web3.js, ethers.js).

### ethers.js

A JavaScript library for interacting with Ethereum. Used in this project for contract calls, transaction signing, and event parsing.

### Provider

In ethers.js, an object that connects to the Ethereum network and can read blockchain state. Does not require a signer.

### Signer

In ethers.js, an object that can sign transactions (has access to a private key). Combined with a provider to send transactions.

### ABI (Application Binary Interface)

A JSON description of a smart contract's functions and events. Required for ethers.js to encode/decode calls.

### JSON-RPC

The protocol used to communicate with Ethereum nodes. MetaMask and providers use JSON-RPC to send requests.

---

## Network Terminology

### Mainnet

The primary Ethereum network where real ETH has value. Use for production deployments only after thorough testing.

### Testnet

A network for testing where ETH has no real value. Examples: Sepolia, Goerli (deprecated). This project uses Sepolia.

### Sepolia

An Ethereum testnet with similar properties to mainnet. Sepolia ETH is free from faucets.

### Hardhat Network

A local Ethereum network for development. Runs entirely on your machine with instant mining and rich debugging.

### Chain ID

A unique identifier for an Ethereum network. Mainnet: 1, Sepolia: 11155111, Hardhat: 31337.

### RPC (Remote Procedure Call)

A protocol for requesting services from a remote server. Ethereum nodes expose JSON-RPC endpoints.

### Faucet

A service that gives free testnet ETH for development and testing.

---

## Project-Specific Terms

### Listing

A marketplace entry representing an item for sale. Contains seller address, price, type, status, and IPFS metadata URI.

### Fixed-Price Listing

A listing where buyers can purchase immediately at the set price.

### Auction Listing

A listing where buyers compete with bids over a time period. Highest bidder wins when the auction ends.

### Escrow Period

The 14-day window after purchase initiation where funds are held by the contract. Buyer confirms delivery or seller releases after deadline.

### Platform Fee

A percentage (2.5% by default) of each sale that goes to the contract. Withdrawable by the contract owner.

### Basis Points

A unit for expressing percentages. 100 basis points = 1%. Platform fee of 250 basis points = 2.5%.

---

## Related Documentation

- [System Architecture](02-system-architecture.md) — How components interact
- [Data & Storage](03-data-and-storage.md) — Data models explained
- [Literature Review Blueprint](09-literature-review-blueprint.md) — Academic overview

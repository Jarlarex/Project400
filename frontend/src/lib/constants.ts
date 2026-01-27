// Chain configurations
export const SUPPORTED_CHAINS = {
  HARDHAT: {
    id: 31337,
    name: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: "",
  },
  SEPOLIA: {
    id: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/",
    blockExplorer: "https://sepolia.etherscan.io",
  },
} as const;

// Default chain for development
export const DEFAULT_CHAIN = SUPPORTED_CHAINS.HARDHAT;

// Contract addresses (updated after deployment)
export const CONTRACT_ADDRESSES = {
  [SUPPORTED_CHAINS.HARDHAT.id]: {
    marketplace: "", // Will be set after local deployment
  },
  [SUPPORTED_CHAINS.SEPOLIA.id]: {
    marketplace: "", // Will be set after Sepolia deployment
  },
} as const;

// Platform fee (2.5% = 250 basis points)
export const PLATFORM_FEE_BPS = 250;
export const PLATFORM_FEE_PERCENT = PLATFORM_FEE_BPS / 100;

// Auction duration limits
export const MIN_AUCTION_DURATION = 3600; // 1 hour in seconds
export const MAX_AUCTION_DURATION = 2592000; // 30 days in seconds

// Bid increment (5%)
export const MIN_BID_INCREMENT_PERCENT = 5;

// IPFS gateway
export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

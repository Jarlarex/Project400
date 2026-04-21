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

// Listing categories (stored in IPFS metadata, not on-chain)
export const CATEGORIES = [
  "Art",
  "Collectibles",
  "Electronics",
  "Fashion",
  "Gaming",
  "Music",
  "Photography",
  "Sports",
  "Other",
] as const;

export type Category = typeof CATEGORIES[number];

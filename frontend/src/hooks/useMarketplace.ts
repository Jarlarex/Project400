"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { parseEther, formatEther } from "ethers";
import { fetchMetadataFromIPFS, ItemMetadata } from "@/lib/ipfs";

export enum ListingType {
  FixedPrice = 0,
  Auction = 1,
}

export enum ListingStatus {
  Active = 0,
  Sold = 1,
  Cancelled = 2,
}

export interface Listing {
  id: bigint;
  seller: string;
  metadataURI: string;
  price: bigint;
  listingType: ListingType;
  status: ListingStatus;
  createdAt: bigint;
  endTime: bigint;
  highestBidder: string;
  highestBid: bigint;
}

export interface ListingWithMetadata extends Listing {
  metadata: ItemMetadata | null;
}

export function useMarketplace() {
  const { marketplace, address, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);

  /**
   * Create a new listing
   */
  const createListing = useCallback(
    async (
      metadataURI: string,
      price: string,
      isAuction: boolean,
      durationInSeconds: number
    ): Promise<bigint | null> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const contractAddress = await marketplace.getAddress();
        console.log("Marketplace contract address:", contractAddress);
        console.log("Creating listing with params:", { metadataURI, price, isAuction, durationInSeconds });
        
        // Check network
        const network = await marketplace.runner?.provider?.getNetwork();
        console.log("Connected to network:", network?.chainId.toString(), network?.name);
        
        const priceWei = parseEther(price);
        
        // Get total listings BEFORE transaction
        console.log("Calling getTotalListings...");
        const totalListingsBefore = await marketplace.getTotalListings();
        console.log("Total listings before:", totalListingsBefore.toString());
        
        const tx = await marketplace.createListing(
          metadataURI,
          priceWei,
          isAuction,
          isAuction ? durationInSeconds : 0
        );

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Receipt:", receipt);
        
        // Get total listings AFTER transaction
        const totalListingsAfter = await marketplace.getTotalListings();
        console.log("Total listings after:", totalListingsAfter.toString());

        // Get listing ID - try multiple methods
        let listingId: bigint | null = null;

        console.log("Number of logs in receipt:", receipt.logs.length);

        // Method 1: Compare total listings before and after
        if (totalListingsAfter > totalListingsBefore) {
          // The new listing ID is totalListingsBefore (0-indexed)
          listingId = totalListingsBefore;
          console.log("Method 1 SUCCESS (before/after comparison) - Listing ID:", listingId.toString());
        }

        // Method 2: Try parsing event logs
        if (!listingId && receipt.logs.length > 0) {
          console.log("Method 1 failed, trying Method 2 (event parsing)...");
          for (const log of receipt.logs) {
            try {
              const parsedLog = marketplace.interface.parseLog(log);
              if (parsedLog && parsedLog.name === "ListingCreated") {
                listingId = parsedLog.args[0];
                console.log("Method 2 SUCCESS - Listing ID:", listingId?.toString());
                break;
              }
            } catch (e) {
              // Skip logs that can't be parsed
            }
          }
        }

        // Method 3: Fallback - just use the count minus 1
        if (!listingId && totalListingsAfter > 0) {
          listingId = totalListingsAfter - BigInt(1);
          console.log("Method 3 (fallback) - Listing ID:", listingId?.toString());
        }

        if (!listingId) {
          throw new Error("Failed to get listing ID from transaction. Contract may have reverted.");
        }

        console.log("Listing created with ID:", listingId?.toString());
        return listingId;
      } catch (err: any) {
        console.error("Error creating listing:", err);
        const message = err.reason || err.message || "Failed to create listing";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Buy a fixed price item
   */
  const buyItem = useCallback(
    async (listingId: bigint, price: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.buyItem(listingId, { value: price });
        await tx.wait();
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to buy item";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Place a bid on an auction
   */
  const placeBid = useCallback(
    async (listingId: bigint, bidAmount: string): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const bidWei = parseEther(bidAmount);
        const tx = await marketplace.placeBid(listingId, { value: bidWei });
        await tx.wait();
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to place bid";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * End an auction
   */
  const endAuction = useCallback(
    async (listingId: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.endAuction(listingId);
        await tx.wait();
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to end auction";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Cancel a listing
   */
  const cancelListing = useCallback(
    async (listingId: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.cancelListing(listingId);
        await tx.wait();
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to cancel listing";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Withdraw a bid from being outbid
   */
  const withdrawBid = useCallback(
    async (listingId: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.withdrawBid(listingId);
        await tx.wait();
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to withdraw bid";
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Get a single listing
   */
  const getListing = useCallback(
    async (listingId: bigint): Promise<Listing | null> => {
      if (!marketplace) return null;

      try {
        const listing = await marketplace.getListing(listingId);
        return listing;
      } catch (err) {
        console.error("Error fetching listing:", err);
        return null;
      }
    },
    [marketplace]
  );

  /**
   * Get a listing with its metadata
   */
  const getListingWithMetadata = useCallback(
    async (listingId: bigint): Promise<ListingWithMetadata | null> => {
      const listing = await getListing(listingId);
      if (!listing) return null;

      const metadata = await fetchMetadataFromIPFS(listing.metadataURI);
      return { ...listing, metadata };
    },
    [getListing]
  );

  /**
   * Get all active listings
   */
  const getActiveListings = useCallback(async (): Promise<bigint[]> => {
    if (!marketplace) return [];

    try {
      const ids = await marketplace.getActiveListings();
      return ids;
    } catch (err) {
      console.error("Error fetching active listings:", err);
      return [];
    }
  }, [marketplace]);

  /**
   * Get listings by user
   */
  const getListingsByUser = useCallback(
    async (userAddress: string): Promise<bigint[]> => {
      if (!marketplace) return [];

      try {
        const ids = await marketplace.getListingsByUser(userAddress);
        return ids;
      } catch (err) {
        console.error("Error fetching user listings:", err);
        return [];
      }
    },
    [marketplace]
  );

  /**
   * Get pending return for a bidder
   */
  const getPendingReturn = useCallback(
    async (listingId: bigint, bidder: string): Promise<bigint> => {
      if (!marketplace) return BigInt(0);

      try {
        return await marketplace.getPendingReturn(listingId, bidder);
      } catch (err) {
        console.error("Error fetching pending return:", err);
        return BigInt(0);
      }
    },
    [marketplace]
  );

  /**
   * Get total listings count
   */
  const getTotalListings = useCallback(async (): Promise<bigint> => {
    if (!marketplace) return BigInt(0);

    try {
      return await marketplace.getTotalListings();
    } catch (err) {
      console.error("Error fetching total listings:", err);
      return BigInt(0);
    }
  }, [marketplace]);

  return {
    isLoading,
    error,
    resetError,
    createListing,
    buyItem,
    placeBid,
    endAuction,
    cancelListing,
    withdrawBid,
    getListing,
    getListingWithMetadata,
    getActiveListings,
    getListingsByUser,
    getPendingReturn,
    getTotalListings,
  };
}

/**
 * Format ETH price for display
 */
export function formatPrice(priceWei: bigint | null | undefined): string {
  if (!priceWei) return "0";
  return formatEther(priceWei);
}

/**
 * Calculate time remaining for auction
 */
export function getTimeRemaining(endTime: bigint): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
} {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(endTime);
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    isEnded: false,
  };
}

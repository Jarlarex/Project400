"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { parseEther, formatEther } from "ethers";
import { fetchMetadataFromIPFS, ItemMetadata } from "@/lib/ipfs";
import toast from "react-hot-toast";

export enum ListingType {
  FixedPrice = 0,
  Auction = 1,
}

export enum ListingStatus {
  Active = 0,
  Sold = 1,
  Cancelled = 2,
  InEscrow = 3,
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
  buyer: string;
  escrowDeadline: bigint;
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
        const priceWei = parseEther(price);

        // Get total listings BEFORE transaction
        const totalListingsBefore = await marketplace.getTotalListings();

        const tx = await marketplace.createListing(
          metadataURI,
          priceWei,
          isAuction,
          isAuction ? durationInSeconds : 0
        );

        const receipt = await tx.wait();

        // Check if transaction succeeded
        if (receipt?.status === 0) {
          throw new Error("Transaction failed - contract reverted");
        }

        // Get total listings AFTER transaction
        const totalListingsAfter = await marketplace.getTotalListings();

        // Get listing ID - try multiple methods
        let listingId: bigint | null = null;

        // Method 1: Compare total listings before and after
        if (totalListingsAfter > totalListingsBefore) {
          listingId = totalListingsBefore;
        }

        // Method 2: Try parsing event logs
        if (!listingId && receipt.logs.length > 0) {
          for (const log of receipt.logs) {
            try {
              const parsedLog = marketplace.interface.parseLog(log);
              if (parsedLog && parsedLog.name === "ListingCreated") {
                listingId = parsedLog.args[0];
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
        }

        if (!listingId) {
          throw new Error("Failed to get listing ID from transaction. Contract may have reverted.");
        }

        toast.success("Listing created successfully!");
        return listingId;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to create listing";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Buy a fixed price item (instant, no escrow)
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
        toast.success("Item purchased successfully!");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to buy item";
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Initiate a purchase with escrow (funds held until confirmed)
   */
  const initiatePurchase = useCallback(
    async (listingId: bigint, price: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.initiatePurchase(listingId, { value: price });
        await tx.wait();
        toast.success("Purchase initiated! Funds are in escrow.");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to initiate purchase";
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Confirm delivery and release funds from escrow (buyer only)
   */
  const confirmDelivery = useCallback(
    async (listingId: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.confirmDelivery(listingId);
        await tx.wait();
        toast.success("Delivery confirmed! Funds released.");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to confirm delivery";
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [marketplace, isConnected]
  );

  /**
   * Release funds from escrow after deadline (seller only)
   */
  const releaseEscrow = useCallback(
    async (listingId: bigint): Promise<boolean> => {
      if (!marketplace || !isConnected) {
        setError("Wallet not connected");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await marketplace.releaseEscrow(listingId);
        await tx.wait();
        toast.success("Escrow funds released!");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to release escrow";
        setError(message);
        toast.error(message);
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
        toast.success("Bid placed successfully!");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to place bid";
        setError(message);
        toast.error(message);
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
        toast.success("Auction ended successfully!");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to end auction";
        setError(message);
        toast.error(message);
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
        toast.success("Listing cancelled.");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to cancel listing";
        setError(message);
        toast.error(message);
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
        toast.success("Bid withdrawn successfully!");
        return true;
      } catch (err: any) {
        const message = err.reason || err.message || "Failed to withdraw bid";
        setError(message);
        toast.error(message);
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
        const result = await marketplace.getListing(listingId);

        const listing: Listing = {
          id: result[0],
          seller: result[1],
          metadataURI: result[2],
          price: result[3],
          listingType: Number(result[4]),
          status: Number(result[5]),
          createdAt: result[6],
          endTime: result[7],
          highestBidder: result[8],
          highestBid: result[9],
          buyer: result[10],
          escrowDeadline: result[11],
        };

        return listing;
      } catch (err) {
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
      return BigInt(0);
    }
  }, [marketplace]);

  return {
    isLoading,
    error,
    resetError,
    createListing,
    buyItem,
    initiatePurchase,
    confirmDelivery,
    releaseEscrow,
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
export function getTimeRemaining(endTime: bigint | null | undefined): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
} {
  if (!endTime) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

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

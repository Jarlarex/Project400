"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@/contexts/WalletContext";
import {
  useMarketplace,
  ListingWithMetadata,
  ListingType,
  ListingStatus,
  formatPrice,
  getTimeRemaining,
} from "@/hooks/useMarketplace";
import { fetchMetadataFromIPFS, getIPFSUrl } from "@/lib/ipfs";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected, connect } = useWallet();
  const {
    getListing,
    buyItem,
    placeBid,
    endAuction,
    cancelListing,
    isLoading,
    error,
    resetError,
  } = useMarketplace();

  const [listing, setListing] = useState<ListingWithMetadata | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false });
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const listingId = params.id as string;

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      setIsPageLoading(true);
      try {
        const data = await getListing(BigInt(listingId));
        if (data) {
          const metadata = await fetchMetadataFromIPFS(data.metadataURI);
          setListing({ ...data, metadata });
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setIsPageLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId, getListing]);

  // Update auction countdown
  useEffect(() => {
    if (!listing || listing.listingType !== ListingType.Auction) return;

    const updateTime = () => {
      setTimeRemaining(getTimeRemaining(listing.endTime));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [listing]);

  const handleBuy = async () => {
    if (!listing) return;
    resetError();

    const success = await buyItem(listing.id, listing.price);
    if (success) {
      setActionSuccess("Purchase successful!");
      // Refresh listing
      const data = await getListing(listing.id);
      if (data) {
        const metadata = await fetchMetadataFromIPFS(data.metadataURI);
        setListing({ ...data, metadata });
      }
    }
  };

  const handleBid = async () => {
    if (!listing || !bidAmount) return;
    resetError();

    const success = await placeBid(listing.id, bidAmount);
    if (success) {
      setActionSuccess("Bid placed successfully!");
      setBidAmount("");
      // Refresh listing
      const data = await getListing(listing.id);
      if (data) {
        const metadata = await fetchMetadataFromIPFS(data.metadataURI);
        setListing({ ...data, metadata });
      }
    }
  };

  const handleEndAuction = async () => {
    if (!listing) return;
    resetError();

    const success = await endAuction(listing.id);
    if (success) {
      setActionSuccess("Auction ended successfully!");
      // Refresh listing
      const data = await getListing(listing.id);
      if (data) {
        const metadata = await fetchMetadataFromIPFS(data.metadataURI);
        setListing({ ...data, metadata });
      }
    }
  };

  const handleCancel = async () => {
    if (!listing) return;
    resetError();

    const success = await cancelListing(listing.id);
    if (success) {
      setActionSuccess("Listing cancelled!");
      router.push("/explore");
    }
  };

  const shortenAddress = (addr?: string) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-[var(--bg-tertiary)] rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-10 bg-[var(--bg-tertiary)] rounded-lg w-3/4 animate-pulse" />
              <div className="h-6 bg-[var(--bg-tertiary)] rounded-lg w-1/2 animate-pulse" />
              <div className="h-24 bg-[var(--bg-tertiary)] rounded-lg animate-pulse" />
              <div className="h-16 bg-[var(--bg-tertiary)] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            This listing doesn&apos;t exist or may have been removed.
          </p>
          <Link href="/explore" className="btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isAuction = listing.listingType === ListingType.Auction;
  const isActive = listing.status === ListingStatus.Active;
  const isSeller = address?.toLowerCase() === listing.seller?.toLowerCase();
  const canBuy = isConnected && !isSeller && isActive && !isAuction;
  const canBid = isConnected && !isSeller && isActive && isAuction && !timeRemaining.isEnded;
  const canEndAuction = isAuction && isActive && timeRemaining.isEnded;
  const canCancel = isSeller && isActive && (!isAuction || listing.highestBidder === "0x0000000000000000000000000000000000000000");

  const minBid = listing.highestBid && listing.highestBid > 0
    ? Number(formatPrice(listing.highestBid)) * 1.05
    : Number(formatPrice(listing.price || BigInt(0)));

  const imageUrl = listing.metadata?.image ? getIPFSUrl(listing.metadata.image) : null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Explore
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--bg-tertiary)]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={listing.metadata?.name || "Item"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <span className={`badge ${isAuction ? "badge-auction" : "badge-fixed"}`}>
                {isAuction ? "Auction" : "Fixed Price"}
              </span>
              {listing.status === ListingStatus.Sold && (
                <span className="badge badge-sold ml-2">Sold</span>
              )}
              {listing.status === ListingStatus.Cancelled && (
                <span className="badge bg-[var(--text-muted)]/20 text-[var(--text-muted)] ml-2">
                  Cancelled
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {listing.metadata?.name || `Item #${listing.id?.toString() ?? 'Unknown'}`}
            </h1>

            <p className="text-[var(--text-secondary)] mb-6">
              Listed by{" "}
              <span className="text-[var(--accent-primary)] font-mono">
                {shortenAddress(listing.seller)}
              </span>
              {isSeller && <span className="ml-2 text-[var(--text-muted)]">(You)</span>}
            </p>

            {listing.metadata?.description && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-[var(--text-secondary)]">{listing.metadata.description}</p>
              </div>
            )}

            {listing.metadata?.category && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Category</h3>
                <span className="px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] capitalize">
                  {listing.metadata.category}
                </span>
              </div>
            )}

            {/* Auction countdown */}
            {isAuction && isActive && (
              <div className="mb-8 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--accent-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {timeRemaining.isEnded ? "Auction Ended" : "Time Remaining"}
                </h3>
                {!timeRemaining.isEnded ? (
                  <div className="flex gap-4 font-mono text-2xl">
                    {timeRemaining.days > 0 && (
                      <div className="text-center">
                        <div className="font-bold">{timeRemaining.days}</div>
                        <div className="text-xs text-[var(--text-muted)]">DAYS</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-bold">{String(timeRemaining.hours).padStart(2, "0")}</div>
                      <div className="text-xs text-[var(--text-muted)]">HRS</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{String(timeRemaining.minutes).padStart(2, "0")}</div>
                      <div className="text-xs text-[var(--text-muted)]">MIN</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{String(timeRemaining.seconds).padStart(2, "0")}</div>
                      <div className="text-xs text-[var(--text-muted)]">SEC</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--accent-warning)]">This auction has ended</p>
                )}
              </div>
            )}

            {/* Price / Bid info */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-1">
                    {isAuction
                      ? listing.highestBid > 0
                        ? "Current Bid"
                        : "Starting Price"
                      : "Price"}
                  </p>
                  <p className="eth-icon text-3xl font-bold">
                    <svg className="w-6 h-6 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z" />
                    </svg>
                    {formatPrice(isAuction && listing.highestBid && listing.highestBid > 0 ? listing.highestBid : listing.price)}
                  </p>
                </div>

                {isAuction && listing.highestBidder !== "0x0000000000000000000000000000000000000000" && (
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-muted)] mb-1">Highest Bidder</p>
                    <p className="font-mono text-[var(--accent-secondary)]">
                      {shortenAddress(listing.highestBidder)}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!isConnected ? (
                <button onClick={connect} className="btn-primary w-full py-4">
                  Connect Wallet to {isAuction ? "Bid" : "Buy"}
                </button>
              ) : canBuy ? (
                <button
                  onClick={handleBuy}
                  disabled={isLoading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </button>
              ) : canBid ? (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min={minBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: ${minBid.toFixed(4)} ETH`}
                      className="input pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">
                      ETH
                    </span>
                  </div>
                  <button
                    onClick={handleBid}
                    disabled={isLoading || !bidAmount}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner" />
                        Processing...
                      </>
                    ) : (
                      "Place Bid"
                    )}
                  </button>
                </div>
              ) : canEndAuction ? (
                <button
                  onClick={handleEndAuction}
                  disabled={isLoading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      Processing...
                    </>
                  ) : (
                    "End Auction"
                  )}
                </button>
              ) : isSeller && isActive ? (
                <p className="text-center text-[var(--text-muted)]">
                  This is your listing
                </p>
              ) : (
                <p className="text-center text-[var(--text-muted)]">
                  {listing.status === ListingStatus.Sold
                    ? "This item has been sold"
                    : "This listing is no longer available"}
                </p>
              )}

              {/* Cancel button for seller */}
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="btn-secondary w-full py-3 mt-4 text-[var(--accent-danger)] border-[var(--accent-danger)]/30 hover:bg-[var(--accent-danger)]/10"
                >
                  Cancel Listing
                </button>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-xl bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/20 text-[var(--accent-danger)] mb-4">
                {error}
              </div>
            )}

            {/* Success message */}
            {actionSuccess && (
              <div className="p-4 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] mb-4">
                {actionSuccess}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

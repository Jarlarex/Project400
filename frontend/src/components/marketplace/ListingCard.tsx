"use client";

import Link from "next/link";
import { ListingWithMetadata, ListingType, ListingStatus, formatPrice, getTimeRemaining } from "@/hooks/useMarketplace";
import { IpfsImage } from "@/components/IpfsImage";
import { useState, useEffect } from "react";

interface ListingCardProps {
  listing: ListingWithMetadata;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(listing.endTime || BigInt(0)));

  // Update countdown timer for auctions
  useEffect(() => {
    if (listing.listingType !== ListingType.Auction || listing.status !== ListingStatus.Active) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(listing.endTime || BigInt(0)));
    }, 1000);

    return () => clearInterval(interval);
  }, [listing.endTime, listing.listingType, listing.status]);

  const isAuction = listing.listingType === ListingType.Auction;
  const isActive = listing.status === ListingStatus.Active;
  const displayPrice = isAuction && listing.highestBid && listing.highestBid > 0 ? listing.highestBid : listing.price || BigInt(0);

  const shortenAddress = (addr?: string) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Link href={`/listing/${listing.id?.toString() ?? '0'}`}>
      <div className="card overflow-hidden group cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square bg-[var(--bg-tertiary)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <IpfsImage
            src={listing.metadata?.image || ""}
            alt={listing.metadata?.name || `Listing #${listing.id?.toString() ?? 'Unknown'}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />

          {/* Status badges */}
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            <span className={isAuction ? "badge badge-auction" : "badge badge-fixed"}>
              {isAuction ? "Auction" : "Fixed"}
            </span>
            {listing.status === ListingStatus.Sold && (
              <span className="badge badge-sold">Sold</span>
            )}
          </div>

          {/* Auction countdown */}
          {isAuction && isActive && !timeRemaining.isEnded && (
            <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-sm border border-[var(--border-color)]">
              <span className="countdown text-xs">
                {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                {String(timeRemaining.hours).padStart(2, "0")}:
                {String(timeRemaining.minutes).padStart(2, "0")}:
                {String(timeRemaining.seconds).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-[var(--accent-primary)] transition-colors">
            {listing.metadata?.name || `Item #${listing.id?.toString() ?? 'Unknown'}`}
          </h3>
          
          <p className="text-sm text-[var(--text-muted)] mb-3 truncate">
            by {shortenAddress(listing.seller)}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">
                {isAuction && listing.highestBid && listing.highestBid > 0 ? "Current Bid" : isAuction ? "Starting Price" : "Price"}
              </p>
              <p className="eth-icon font-semibold text-lg">
                <svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z" />
                </svg>
                {formatPrice(displayPrice)}
              </p>
            </div>

            {isAuction && listing.highestBid && listing.highestBid > 0 && (
              <div className="text-right">
                <p className="text-xs text-[var(--text-muted)] mb-1">Bids</p>
                <p className="text-sm font-medium text-[var(--accent-secondary)]">
                  {listing.highestBidder && listing.highestBidder !== "0x0000000000000000000000000000000000000000" ? "1+" : "0"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

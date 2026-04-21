"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketplace, ListingWithMetadata, ListingType, ListingStatus, formatPrice } from "@/hooks/useMarketplace";
import { fetchMetadataFromIPFS } from "@/lib/ipfs";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { useWallet } from "@/contexts/WalletContext";
import { CATEGORIES } from "@/lib/constants";
import { ethers } from "ethers";

type TypeFilter = "all" | "fixed" | "auction";
type StatusFilter = "all" | "active" | "sold" | "ended";
type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "ending-soon";

function ExploreContent() {
  const searchParams = useSearchParams();
  const { marketplace } = useWallet();
  const { getActiveListings, getListing } = useMarketplace();

  const [listings, setListings] = useState<ListingWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(
    (searchParams.get("type") as TypeFilter) || "all"
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const hasActiveFilters =
    searchQuery !== "" ||
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    sortOption !== "newest" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    categoryFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setSortOption("newest");
    setMinPrice("");
    setMaxPrice("");
    setCategoryFilter("all");
  };

  useEffect(() => {
    const fetchListings = async () => {
      if (!marketplace) {
        setIsLoading(false);
        setListings([]);
        return;
      }

      setIsLoading(true);
      try {
        const ids = await getActiveListings();

        const listingPromises = ids.map(async (id) => {
          try {
            const listing = await getListing(id);

            if (listing) {
              const cid = listing.metadataURI?.replace("ipfs://", "");
              if (!cid || cid.length < 20 || (!cid.startsWith("Qm") && !cid.startsWith("baf"))) {
                return null;
              }

              let metadata = null;
              try {
                metadata = await fetchMetadataFromIPFS(listing.metadataURI);
              } catch (metaError) {
                // Metadata fetch failed, continue with null metadata
              }
              return { ...listing, metadata };
            }
          } catch (listingError) {
            // Failed to fetch listing, skip it
          }
          return null;
        });

        const fetchedListings = (await Promise.all(listingPromises)).filter(
          (l): l is ListingWithMetadata => l !== null
        );

        setListings(fetchedListings);
      } catch (error) {
        // Failed to fetch listings
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [marketplace, getActiveListings, getListing]);

  // Compute filtered and sorted listings
  const filteredListings = useMemo(() => {
    const now = BigInt(Math.floor(Date.now() / 1000));

    let result = listings.filter((listing) => {
      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = listing.metadata?.name?.toLowerCase() || "";
        const description = listing.metadata?.description?.toLowerCase() || "";
        if (!name.includes(query) && !description.includes(query)) return false;
      }

      // Type filter
      if (typeFilter === "fixed" && listing.listingType !== ListingType.FixedPrice) return false;
      if (typeFilter === "auction" && listing.listingType !== ListingType.Auction) return false;

      // Status filter
      if (statusFilter !== "all") {
        const isAuction = listing.listingType === ListingType.Auction;
        const isPastEndTime = isAuction && listing.endTime > BigInt(0) && listing.endTime < now;

        if (statusFilter === "active") {
          if (listing.status !== ListingStatus.Active) return false;
          if (isPastEndTime) return false;
        } else if (statusFilter === "ended") {
          if (!isPastEndTime || listing.status !== ListingStatus.Active) return false;
        } else if (statusFilter === "sold") {
          if (listing.status !== ListingStatus.Sold && listing.status !== ListingStatus.InEscrow) return false;
        }
      }

      // Price range filter
      const displayPrice = listing.listingType === ListingType.Auction && listing.highestBid > BigInt(0)
        ? listing.highestBid
        : listing.price;

      if (minPrice !== "") {
        try {
          const minWei = ethers.parseEther(minPrice);
          if (displayPrice < minWei) return false;
        } catch {
          // Invalid input, ignore
        }
      }
      if (maxPrice !== "") {
        try {
          const maxWei = ethers.parseEther(maxPrice);
          if (displayPrice > maxWei) return false;
        } catch {
          // Invalid input, ignore
        }
      }

      // Category filter
      if (categoryFilter !== "all") {
        const listingCategory = listing.metadata?.category || "Other";
        if (listingCategory !== categoryFilter) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return Number(b.createdAt - a.createdAt);
        case "oldest":
          return Number(a.createdAt - b.createdAt);
        case "price-low": {
          const priceA = a.listingType === ListingType.Auction && a.highestBid > BigInt(0) ? a.highestBid : a.price;
          const priceB = b.listingType === ListingType.Auction && b.highestBid > BigInt(0) ? b.highestBid : b.price;
          return Number(priceA - priceB);
        }
        case "price-high": {
          const priceA = a.listingType === ListingType.Auction && a.highestBid > BigInt(0) ? a.highestBid : a.price;
          const priceB = b.listingType === ListingType.Auction && b.highestBid > BigInt(0) ? b.highestBid : b.price;
          return Number(priceB - priceA);
        }
        case "ending-soon": {
          const now = BigInt(Math.floor(Date.now() / 1000));
          const isActiveAuctionA = a.listingType === ListingType.Auction && a.status === ListingStatus.Active && a.endTime > now;
          const isActiveAuctionB = b.listingType === ListingType.Auction && b.status === ListingStatus.Active && b.endTime > now;

          if (isActiveAuctionA && isActiveAuctionB) return Number(a.endTime - b.endTime);
          if (isActiveAuctionA) return -1;
          if (isActiveAuctionB) return 1;
          return Number(b.createdAt - a.createdAt);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [listings, searchQuery, typeFilter, statusFilter, sortOption, minPrice, maxPrice, categoryFilter]);

  const pillClass = (active: boolean) =>
    active
      ? "px-4 py-2 rounded-[20px] text-sm font-medium transition-colors bg-[#E07A5F] text-[#2D3142]"
      : "px-4 py-2 rounded-[20px] text-sm font-medium transition-colors bg-[rgba(244,241,222,0.06)] text-[rgba(244,241,222,0.5)] hover:text-[rgba(244,241,222,0.7)]";

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Marketplace</h1>
          <p className="text-[var(--text-secondary)]">
            Discover unique items from sellers around the world
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={pillClass(categoryFilter === "all")}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={pillClass(categoryFilter === cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Row 1: Type pills, Status pills, Sort dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
            {/* Type filter */}
            <div className="flex gap-2 flex-wrap">
              {(
                [
                  ["all", "All"],
                  ["fixed", "Fixed Price"],
                  ["auction", "Auction"],
                ] as [TypeFilter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={pillClass(typeFilter === value)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-[var(--border-color)]" />

            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {(
                [
                  ["all", "All"],
                  ["active", "Active"],
                  ["sold", "Sold"],
                  ["ended", "Ended"],
                ] as [StatusFilter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={pillClass(statusFilter === value)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-[var(--border-color)]" />

            {/* Sort dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-[rgba(244,241,222,0.06)] border border-[rgba(244,241,222,0.08)] text-[#F4F1DE] rounded-[6px] px-3 py-2 text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="ending-soon">Ending Soon</option>
            </select>
          </div>

          {/* Row 2: Price range + Clear filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ETH"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
                className="bg-[rgba(244,241,222,0.06)] border border-[rgba(244,241,222,0.08)] text-[#F4F1DE] rounded-[6px] px-3 py-2 text-sm w-28 outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[rgba(244,241,222,0.3)]"
              />
              <span className="text-[var(--text-muted)] text-sm">to</span>
              <input
                type="number"
                placeholder="Max ETH"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
                className="bg-[rgba(244,241,222,0.06)] border border-[rgba(244,241,222,0.08)] text-[#F4F1DE] rounded-[6px] px-3 py-2 text-sm w-28 outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[rgba(244,241,222,0.3)]"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[rgba(244,241,222,0.45)] text-sm hover:text-[var(--text-primary)] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Result count */}
        <p className="text-[rgba(244,241,222,0.45)] text-sm mb-6">
          Showing {filteredListings.length} of {listings.length} listings
        </p>

        {/* Listings grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square bg-[var(--bg-tertiary)]" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                  <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id?.toString() ?? Math.random().toString()} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[var(--text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No listings match your filters</h3>
            <p className="text-[var(--text-muted)] mb-6">
              Try adjusting your search or filters to find what you&apos;re looking for
            </p>
            <button
              onClick={clearFilters}
              className="text-[var(--accent-primary)] hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="h-10 bg-[var(--bg-tertiary)] rounded-lg w-64 animate-pulse mb-4" />
          <div className="h-6 bg-[var(--bg-tertiary)] rounded-lg w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-square bg-[var(--bg-tertiary)]" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExploreContent />
    </Suspense>
  );
}

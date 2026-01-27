"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketplace, ListingWithMetadata, ListingType, ListingStatus } from "@/hooks/useMarketplace";
import { fetchMetadataFromIPFS } from "@/lib/ipfs";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { useWallet } from "@/contexts/WalletContext";

type FilterType = "all" | "fixed" | "auction";

function ExploreContent() {
  const searchParams = useSearchParams();
  const { marketplace } = useWallet();
  const { getActiveListings, getListing } = useMarketplace();

  const [listings, setListings] = useState<ListingWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>(
    (searchParams.get("type") as FilterType) || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      if (!marketplace) return;

      setIsLoading(true);
      try {
        const ids = await getActiveListings();
        const listingPromises = ids.map(async (id) => {
          const listing = await getListing(id);
          if (listing) {
            const metadata = await fetchMetadataFromIPFS(listing.metadataURI);
            return { ...listing, metadata };
          }
          return null;
        });

        const fetchedListings = (await Promise.all(listingPromises)).filter(
          (l): l is ListingWithMetadata => l !== null
        );

        setListings(fetchedListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [marketplace, getActiveListings, getListing]);

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    // Type filter
    if (filter === "fixed" && listing.listingType !== ListingType.FixedPrice) return false;
    if (filter === "auction" && listing.listingType !== ListingType.Auction) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = listing.metadata?.name?.toLowerCase() || "";
      const description = listing.metadata?.description?.toLowerCase() || "";
      return name.includes(query) || description.includes(query);
    }

    return true;
  });

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
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

          {/* Type filter */}
          <div className="flex rounded-xl border border-[var(--border-color)] overflow-hidden">
            {(["all", "fixed", "auction"] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  filter === type
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-[var(--text-muted)] mb-6">
          {filteredListings.length} item{filteredListings.length !== 1 ? "s" : ""} found
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
              <ListingCard key={listing.id.toString()} listing={listing} />
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
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-[var(--text-muted)] mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Be the first to list an item on the marketplace!"}
            </p>
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

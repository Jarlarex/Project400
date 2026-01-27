"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useMarketplace, ListingWithMetadata, ListingStatus, ListingType, formatPrice } from "@/hooks/useMarketplace";
import { fetchMetadataFromIPFS } from "@/lib/ipfs";
import { ListingCard } from "@/components/marketplace/ListingCard";
import Link from "next/link";

type TabType = "listings" | "purchased" | "bids";

export default function ProfilePage() {
  const { address, isConnected, connect, balance } = useWallet();
  const { getListingsByUser, getListing } = useMarketplace();

  const [activeTab, setActiveTab] = useState<TabType>("listings");
  const [listings, setListings] = useState<ListingWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!address) return;

      setIsLoading(true);
      try {
        const ids = await getListingsByUser(address);
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
        console.error("Error fetching user listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchUserListings();
    }
  }, [address, isConnected, getListingsByUser, getListing]);

  const shortenAddress = (addr?: string) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Filter listings by tab
  const filteredListings = listings.filter((listing) => {
    if (activeTab === "listings") {
      return listing.seller?.toLowerCase() === address?.toLowerCase();
    }
    return true;
  });

  const activeListings = filteredListings.filter((l) => l.status === ListingStatus.Active);
  const soldListings = filteredListings.filter((l) => l.status === ListingStatus.Sold);

  // Calculate stats
  const totalListings = listings.length;
  const activeSales = listings.filter((l) => l.status === ListingStatus.Active).length;
  const totalSold = listings.filter((l) => l.status === ListingStatus.Sold).length;
  const totalVolume = listings
    .filter((l) => l.status === ListingStatus.Sold)
    .reduce((acc, l) => acc + l.price, BigInt(0));

  if (!isConnected) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00d4aa]/20 to-[#7c3aed]/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[var(--accent-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">View Your Profile</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Connect your wallet to view your listings, purchases, and transaction history.
          </p>
          <button onClick={connect} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#7c3aed] flex items-center justify-center text-3xl font-bold text-[var(--bg-primary)]">
              {address?.slice(2, 4).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 font-mono">
                {shortenAddress(address!)}
              </h1>
              <div className="flex items-center gap-4 text-[var(--text-secondary)]">
                <span className="eth-icon">
                  <svg className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z" />
                  </svg>
                  {balance} ETH
                </span>
                <span className="text-[var(--text-muted)]">•</span>
                <button
                  onClick={() => navigator.clipboard.writeText(address!)}
                  className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Address
                </button>
              </div>
            </div>

            {/* Actions */}
            <Link href="/create" className="btn-primary">
              Create Listing
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[var(--border-color)]">
            <div>
              <p className="text-2xl font-bold gradient-text">{totalListings}</p>
              <p className="text-sm text-[var(--text-muted)]">Total Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--accent-primary)]">{activeSales}</p>
              <p className="text-sm text-[var(--text-muted)]">Active Sales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--accent-secondary)]">{totalSold}</p>
              <p className="text-sm text-[var(--text-muted)]">Items Sold</p>
            </div>
            <div>
              <p className="text-2xl font-bold eth-icon">
                <svg className="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z" />
                </svg>
                {formatPrice(totalVolume)}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Total Volume</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[var(--border-color)]">
          {[
            { id: "listings" as TabType, label: "My Listings", count: totalListings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-[var(--bg-tertiary)]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <div>
            {/* Active Listings */}
            {activeListings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                  Active Listings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeListings.map((listing) => (
                    <ListingCard key={listing.id?.toString() ?? Math.random().toString()} listing={listing} />
                  ))}
                </div>
              </div>
            )}

            {/* Sold Listings */}
            {soldListings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                  Sold Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {soldListings.map((listing) => (
                    <ListingCard key={listing.id?.toString() ?? Math.random().toString()} listing={listing} />
                  ))}
                </div>
              </div>
            )}
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
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-[var(--text-muted)] mb-6">
              Create your first listing and start selling on the marketplace!
            </p>
            <Link href="/create" className="btn-primary">
              Create Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

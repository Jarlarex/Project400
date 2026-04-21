"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useMarketplace, ListingWithMetadata, ListingStatus, ListingType, formatPrice } from "@/hooks/useMarketplace";
import { fetchMetadataFromIPFS } from "@/lib/ipfs";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";

type TabType = "listings" | "purchased";

export default function ProfilePage() {
  const { address, isConnected, connect, balance } = useWallet();
  const { getListingsByUser, getListing, getTotalListings } = useMarketplace();

  const [activeTab, setActiveTab] = useState<TabType>("listings");
  const [listings, setListings] = useState<ListingWithMetadata[]>([]);
  const [purchasedListings, setPurchasedListings] = useState<ListingWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!address) return;

      setIsLoading(true);
      try {
        // Fetch seller listings
        const ids = await getListingsByUser(address);
        const listingPromises = ids.map(async (id) => {
          const listing = await getListing(id);
          if (listing) {
            const cid = listing.metadataURI?.replace("ipfs://", "");
            if (!cid || cid.length < 20 || (!cid.startsWith("Qm") && !cid.startsWith("baf"))) {
              return null;
            }
            const metadata = await fetchMetadataFromIPFS(listing.metadataURI);
            return { ...listing, metadata };
          }
          return null;
        });

        const fetchedListings = (await Promise.all(listingPromises)).filter(
          (l): l is ListingWithMetadata => l !== null
        );
        setListings(fetchedListings);

        // NOTE: Currently scans all listings client-side via getTotalListings() and filters by buyer address.
        // This is O(n) and suitable for small-to-medium listing counts. For production scale,
        // a contract-level getListingsByBuyer(address) view function would be more efficient.
        const totalCount = await getTotalListings();
        const total = Number(totalCount);
        const purchasedPromises: Promise<ListingWithMetadata | null>[] = [];

        for (let i = 0; i < total; i++) {
          purchasedPromises.push(
            (async () => {
              const listing = await getListing(BigInt(i));
              if (!listing) return null;
              if (listing.buyer?.toLowerCase() !== address.toLowerCase()) return null;
              if (listing.status !== ListingStatus.Sold && listing.status !== ListingStatus.InEscrow) return null;

              const cid = listing.metadataURI?.replace("ipfs://", "");
              if (!cid || cid.length < 20 || (!cid.startsWith("Qm") && !cid.startsWith("baf"))) {
                return null;
              }
              const metadata = await fetchMetadataFromIPFS(listing.metadataURI);
              return { ...listing, metadata };
            })()
          );
        }

        const fetchedPurchased = (await Promise.all(purchasedPromises)).filter(
          (l): l is ListingWithMetadata => l !== null
        );
        setPurchasedListings(fetchedPurchased);
      } catch (error) {
        // Failed to fetch user data
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchUserData();
    }
  }, [address, isConnected, getListingsByUser, getListing, getTotalListings]);

  // Filter listings by tab
  const myListings = listings.filter((listing) => {
    return listing.seller?.toLowerCase() === address?.toLowerCase();
  });

  const activeListings = myListings.filter((l) => l.status === ListingStatus.Active);
  const inEscrowListings = myListings.filter((l) => l.status === ListingStatus.InEscrow);
  const soldListings = myListings.filter((l) => l.status === ListingStatus.Sold);

  // Calculate stats
  const totalListingsCount = listings.length;
  const activeSales = listings.filter((l) => l.status === ListingStatus.Active).length;
  const inEscrowCount = listings.filter((l) => l.status === ListingStatus.InEscrow).length;
  const totalSold = listings.filter((l) => l.status === ListingStatus.Sold).length;
  const totalVolume = listings
    .filter((l) => l.status === ListingStatus.Sold)
    .reduce((acc, l) => acc + l.price, BigInt(0));

  if (!isConnected) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-[10px] bg-[var(--accent-primary)]/10 flex items-center justify-center">
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

  const displayedListings = activeTab === "listings" ? myListings : purchasedListings;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-[10px] bg-[var(--accent-primary)] flex items-center justify-center text-3xl font-bold text-[var(--bg-primary)]">
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
                <span className="text-[var(--text-muted)]">&bull;</span>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t border-[var(--border-color)]">
            <div>
              <p className="text-2xl font-bold text-[var(--accent-primary)]">{totalListingsCount}</p>
              <p className="text-sm text-[var(--text-muted)]">Total Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--accent-primary)]">{activeSales}</p>
              <p className="text-sm text-[var(--text-muted)]">Active Sales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--accent-primary)]">
                {inEscrowCount}
              </p>
              <p className="text-sm text-[var(--text-muted)]">In Escrow</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{totalSold}</p>
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
            { id: "listings" as TabType, label: "My Listings", count: totalListingsCount },
            { id: "purchased" as TabType, label: "Purchased", count: purchasedListings.length },
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
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-[var(--surface-elevated)]">
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
        ) : activeTab === "listings" ? (
          displayedListings.length > 0 ? (
            <div>
              {/* In Escrow Listings - Action Required */}
              {inEscrowListings.length > 0 && (
                <div className="mb-12">
                  <div className="bg-[var(--accent-primary)]/10 border-2 border-[var(--accent-primary)]/30 rounded-[10px] p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-[var(--accent-primary)] mb-1">
                          Action Required - Items In Escrow
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)]">
                          You have {inEscrowListings.length} item{inEscrowListings.length > 1 ? 's' : ''} with funds in escrow.
                          Ship the item{inEscrowListings.length > 1 ? 's' : ''} to the buyer{inEscrowListings.length > 1 ? 's' : ''} immediately!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inEscrowListings.map((listing) => (
                      <div key={listing.id?.toString() ?? Math.random().toString()} className="relative">
                        <div className="absolute -top-2 -right-2 z-10 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                          IN ESCROW
                        </div>
                        <ListingCard listing={listing} />
                        <div className="mt-2 p-3 bg-[var(--bg-secondary)] rounded-[10px] border border-[var(--accent-primary)]/20">
                          <p className="text-xs text-[var(--text-muted)] mb-1">Buyer:</p>
                          <p className="text-sm font-mono text-[var(--text-primary)] mb-2">
                            {shortenAddress(listing.buyer)}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mb-1">Escrow Deadline:</p>
                          <p className="text-sm font-semibold text-[var(--accent-primary)]">
                            {listing.escrowDeadline
                              ? new Date(Number(listing.escrowDeadline) * 1000).toLocaleString()
                              : "N/A"}
                          </p>
                          <Link
                            href={`/listing/${listing.id?.toString()}`}
                            className="mt-3 w-full btn-secondary text-center block"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
          )
        ) : (
          /* Purchased tab */
          purchasedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {purchasedListings.map((listing) => (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-[var(--text-muted)] mb-6">
                Items you buy on the marketplace will appear here.
              </p>
              <Link href="/explore" className="btn-primary">
                Explore Marketplace
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useWallet } from "@/contexts/WalletContext";

export default function Home() {
  const { connect, isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
              The Future of{" "}
              <span className="gradient-text">Decentralized</span>{" "}
              Commerce
          </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
              Buy, sell, and auction items directly on the blockchain.
              Low 2.5% platform fee, secure escrow, full transparency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
              <Link href="/explore" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                Explore Marketplace
              </Link>
              {!isConnected && (
                <button onClick={connect} className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-0 animate-slide-up stagger-3" style={{ animationFillMode: 'forwards' }}>
            {[
              { label: "Platform Fee", value: "2.5%" },
              { label: "Network", value: "Sepolia" },
              { label: "Secure", value: "100%" },
              { label: "Decentralized", value: "Yes" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="card p-6 text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--text-secondary)] text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Trade securely with smart contracts handling all transactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00d4aa]/20 to-[#00d4aa]/5 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--accent-primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
              <p className="text-[var(--text-secondary)]">
                Link your MetaMask wallet to start buying or selling items instantly
          </p>
        </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#7c3aed]/5 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--accent-secondary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">List or Buy</h3>
              <p className="text-[var(--text-secondary)]">
                Create listings with fixed prices or auctions, or browse and purchase items
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[var(--accent-warning)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trade Securely</h3>
              <p className="text-[var(--text-secondary)]">
                All transactions are secured by smart contracts with escrow protection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d4aa]/10 to-[#7c3aed]/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Trading?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                Join the decentralized marketplace revolution. List your first item or explore what others have to offer.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/create" className="btn-primary text-lg px-8 py-4">
                  Create Listing
                </Link>
                <Link href="/explore" className="btn-secondary text-lg px-8 py-4">
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-[var(--text-muted)] uppercase tracking-wider text-sm font-semibold mb-4">
              Built With
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-[var(--text-muted)]">
            {["Solidity", "Next.js", "ethers.js", "IPFS", "MetaMask", "OpenZeppelin"].map((tech) => (
              <span key={tech} className="text-lg font-medium hover:text-[var(--text-primary)] transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

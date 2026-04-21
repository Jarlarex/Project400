"use client";

import Link from "next/link";
import { useWallet } from "@/contexts/WalletContext";
import { shortenAddress } from "@/lib/utils";
import { useState } from "react";

export function Header() {
  const { address, isConnected, isConnecting, isWrongNetwork, balance, connect, disconnect, switchNetwork } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
    {isWrongNetwork && (
      <div className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-4 py-3 text-center text-sm font-medium sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span>You&apos;re connected to the wrong network. Please switch to Sepolia to use DecentraMarket.</span>
          <button
            onClick={() => switchNetwork(11155111)}
            className="px-4 py-1.5 rounded-[6px] bg-[var(--bg-primary)] text-[var(--accent-primary)] font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Switch to Sepolia
          </button>
        </div>
      </div>
    )}
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-[6px] bg-[var(--accent-primary)] flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-[var(--bg-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold hidden sm:block">
              <span className="text-[var(--accent-primary)]">Decentra</span>
              <span className="text-[var(--text-primary)]">Market</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/explore"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
            >
              Create
            </Link>
            {isConnected && (
              <Link
                href="/profile"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
              >
                Profile
              </Link>
            )}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--input-bg)] border border-[var(--input-border)]">
                  <span className="eth-icon text-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z" />
                    </svg>
                    {balance}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[var(--input-bg)] border border-[var(--input-border)] hover:border-[var(--accent-primary)] transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  <span className="font-medium text-sm">{shortenAddress(address!)}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <span className="spinner" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-[6px] hover:bg-[var(--surface-elevated)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border-color)]">
            <nav className="flex flex-col gap-2">
              <Link
                href="/explore"
                className="px-4 py-2 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create
              </Link>
              {isConnected && (
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-[6px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

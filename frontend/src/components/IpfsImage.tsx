"use client";

import { useState } from "react";
import { ipfsToHttpUrls } from "@/lib/ipfs";

interface IpfsImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Image component with IPFS gateway fallback support
 * Automatically tries multiple gateways if one fails
 */
export function IpfsImage({ src, alt, className }: IpfsImageProps) {
  const candidates = ipfsToHttpUrls(src);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (currentIndex < candidates.length - 1) {
      // Try next gateway
      setCurrentIndex(currentIndex + 1);
    } else {
      // All gateways failed
      setFailed(true);
    }
  };

  if (failed || !src) {
    // Show placeholder when all gateways fail or no src
    return (
      <div className={`flex items-center justify-center bg-[var(--bg-tertiary)] ${className || ""}`}>
        <svg
          className="w-16 h-16 text-[var(--text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={candidates[currentIndex]}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}

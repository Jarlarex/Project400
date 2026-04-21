/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(addr?: string): string {
  if (!addr) return "Unknown";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

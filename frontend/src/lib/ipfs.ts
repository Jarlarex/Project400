// Note: Pinata SDK is now only used server-side in API routes
// Client-side uploads go through /api/ipfs/upload for security

/**
 * Public IPFS gateways (in order of preference)
 */
const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
];

export interface ItemMetadata {
  name: string;
  description: string;
  image: string; // IPFS CID of the image
  attributes?: {
    trait_type: string;
    value: string;
  }[];
  category?: string;
  createdAt: string;
}

/**
 * Upload a file to IPFS via server-side API route
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("type", "file");
    formData.append("file", file);

    const response = await fetch("/api/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ IPFS Upload Error Response:", errorData);
      console.error("Status:", response.status, response.statusText);
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cid;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * Upload JSON metadata to IPFS via server-side API route
 */
export async function uploadMetadataToIPFS(metadata: ItemMetadata): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("type", "json");
    formData.append("data", JSON.stringify(metadata));

    const response = await fetch("/api/ipfs/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ IPFS Metadata Upload Error Response:", errorData);
      console.error("Status:", response.status, response.statusText);
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cid;
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}

/**
 * Validate if a string is a valid IPFS CID
 */
export function isValidCID(cid: string): boolean {
  if (!cid || cid.length < 20) return false;
  
  // CIDv0 starts with "Qm" and is 46 characters
  if (cid.startsWith("Qm") && cid.length === 46) return true;
  
  // CIDv1 starts with "baf" (base32) or "b" (multibase)
  if (cid.startsWith("baf") || cid.startsWith("bafy") || cid.startsWith("bafk")) return true;
  
  return false;
}

/**
 * Convert ipfs:// URI to multiple HTTP gateway URLs (fallback support)
 */
export function ipfsToHttpUrls(ipfsUri: string): string[] {
  if (!ipfsUri?.startsWith("ipfs://")) return [ipfsUri];
  const cid = ipfsUri.replace("ipfs://", "");
  return IPFS_GATEWAYS.map(gw => `${gw}${cid}`);
}

/**
 * Get the first IPFS gateway URL for a CID (for backward compatibility)
 */
export function getIPFSUrl(cid: string): string {
  if (!cid) return "";
  
  // Handle ipfs:// protocol
  if (cid.startsWith("ipfs://")) {
    cid = cid.replace("ipfs://", "");
  }
  
  // Use first gateway (ipfs.io)
  return `${IPFS_GATEWAYS[0]}${cid}`;
}

/**
 * Fetch metadata from IPFS with gateway fallbacks
 */
export async function fetchMetadataFromIPFS(uri: string): Promise<ItemMetadata | null> {
  try {
    const raw = uri?.trim();
    if (!raw) return null;

    // Extract CID (basic)
    const cid = raw.startsWith("ipfs://") ? raw.slice("ipfs://".length) : raw;

    // Validate CID format (real CIDs are 46+ chars for v0, or start with specific prefixes)
    if (cid.length < 20 || (!cid.startsWith("Qm") && !cid.startsWith("baf"))) {
      console.warn("Invalid CID format for metadata:", uri);
      return null;
    }

    const gatewayUrls = IPFS_GATEWAYS.map(gw => `${gw}${cid}`);
    let lastError: unknown = null;

    for (const url of gatewayUrls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        lastError = e;
        // try next gateway
      }
    }

    console.error("All IPFS gateways failed for:", cid, lastError);
    return null;
  } catch (error) {
    console.error("Error fetching metadata from IPFS:", error);
    return null;
  }
}

/**
 * Upload an item listing to IPFS (image + metadata)
 */
export async function uploadListingToIPFS(
  name: string,
  description: string,
  imageFile: File,
  category?: string,
  attributes?: { trait_type: string; value: string }[]
): Promise<{ metadataUri: string; imageCid: string }> {
  // Upload image first
  const imageCid = await uploadFileToIPFS(imageFile);
  
  // Create metadata
  const metadata: ItemMetadata = {
    name,
    description,
    image: `ipfs://${imageCid}`,
    category,
    attributes,
    createdAt: new Date().toISOString(),
  };
  
  // Upload metadata
  const metadataCid = await uploadMetadataToIPFS(metadata);
  
  return {
    metadataUri: `ipfs://${metadataCid}`,
    imageCid,
  };
}

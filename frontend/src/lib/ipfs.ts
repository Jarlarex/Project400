import { PinataSDK } from "pinata";

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT || "",
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud",
});

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
 * Upload a file to IPFS via Pinata
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    const result = await pinata.upload.public.file(file);
    return result.cid;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(metadata: ItemMetadata): Promise<string> {
  try {
    const result = await pinata.upload.public.json(metadata);
    return result.cid;
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}

/**
 * Get the IPFS gateway URL for a CID
 */
export function getIPFSUrl(cid: string): string {
  if (!cid) return "";
  
  // Handle ipfs:// protocol
  if (cid.startsWith("ipfs://")) {
    cid = cid.replace("ipfs://", "");
  }
  
  // Use Cloudflare's IPFS gateway (best SSL compatibility on Windows)
  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
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

    // Reject obvious non-CIDs (e.g., "test123" case)
    // Simple heuristic: real CIDs are much longer
    if (cid.length < 20) {
      console.warn("Invalid CID/uri for metadata:", uri);
      return null;
    }

    const gateways = [
      `https://cloudflare-ipfs.com/ipfs/${cid}`,
      `https://dweb.link/ipfs/${cid}`,
      `https://ipfs.io/ipfs/${cid}`,
      // Keep Pinata last (since it may have SSL issues)
      `https://gateway.pinata.cloud/ipfs/${cid}`,
    ];

    let lastError: unknown = null;

    for (const url of gateways) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);
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

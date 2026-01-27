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
 * Fetch metadata from IPFS using Pinata's authenticated API
 */
export async function fetchMetadataFromIPFS(uri: string): Promise<ItemMetadata | null> {
  try {
    // Extract CID from ipfs:// URI
    let cid = uri.startsWith("ipfs://") ? uri.replace("ipfs://", "") : uri;
    
    // Use Pinata's Gateway API with JWT authentication (bypasses SSL issues)
    const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
    
    const url = `https://${gateway}/ipfs/${cid}`;
    
    const headers: HeadersInit = {};
    if (pinataJwt) {
      headers['Authorization'] = `Bearer ${pinataJwt}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    
    return await response.json();
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

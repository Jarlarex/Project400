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
  
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
  return `https://${gateway}/ipfs/${cid}`;
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchMetadataFromIPFS(uri: string): Promise<ItemMetadata | null> {
  try {
    const url = uri.startsWith("ipfs://") ? getIPFSUrl(uri) : uri;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch metadata");
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

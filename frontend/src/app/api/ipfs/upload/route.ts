import { NextRequest, NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";

// Initialize Pinata with server-side JWT or API Key + Secret
// Supports both authentication methods
let pinata: any;

if (process.env.PINATA_JWT) {
  console.log("🔑 Initializing Pinata with JWT");
  pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
} else if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
  console.log("🔑 Initializing Pinata with API Key + Secret");
  pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);
} else {
  console.error("❌ No Pinata credentials found! Need either PINATA_JWT or (PINATA_API_KEY + PINATA_SECRET_API_KEY)");
}

export async function POST(request: NextRequest) {
  // 🕵️ DEBUG: Check which env vars are present
  console.log("=== PINATA ENV VAR CHECK ===");
  console.log("PINATA_JWT present?", Boolean(process.env.PINATA_JWT));
  console.log("PINATA_API_KEY present?", Boolean(process.env.PINATA_API_KEY));
  console.log("PINATA_SECRET present?", Boolean(process.env.PINATA_SECRET_API_KEY));
  console.log("PINATA_GATEWAY present?", Boolean(process.env.PINATA_GATEWAY));
  if (process.env.PINATA_JWT) {
    console.log("PINATA_JWT first 10 chars:", process.env.PINATA_JWT.substring(0, 10) + "...");
  }
  console.log("Pinata SDK initialized?", Boolean(pinata));
  console.log("===========================");
  
  if (!pinata) {
    return NextResponse.json(
      {
        error: "Pinata not configured",
        message: "Missing PINATA_JWT or (PINATA_API_KEY + PINATA_SECRET_API_KEY) in environment variables",
      },
      { status: 500 }
    );
  }
  
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;

    if (type === "file") {
      // Upload file (image)
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      console.log("Uploading file to Pinata:", file.name, file.type, file.size);
      
      // Convert File to Buffer and then to Readable stream for @pinata/sdk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const stream = Readable.from(buffer);
      
      const options = {
        pinataMetadata: {
          name: file.name,
        },
      };
      
      const result = await pinata.pinFileToIPFS(stream, options);
      console.log("File uploaded successfully, CID:", result.IpfsHash);
      
      return NextResponse.json({ cid: result.IpfsHash });
    } else if (type === "json") {
      // Upload JSON metadata
      const jsonData = formData.get("data") as string;
      if (!jsonData) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
      }

      const metadata = JSON.parse(jsonData);
      console.log("Uploading JSON metadata to Pinata");
      
      const options = {
        pinataMetadata: {
          name: metadata.name || "marketplace-metadata",
        },
      };
      
      const result = await pinata.pinJSONToIPFS(metadata, options);
      console.log("Metadata uploaded successfully, CID:", result.IpfsHash);
      
      return NextResponse.json({ cid: result.IpfsHash });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("IPFS upload failed:", err);
    console.error("Full error object:", JSON.stringify(err, null, 2));
    
    return NextResponse.json(
      {
        error: "Failed to upload to IPFS",
        message: err?.message,
        status: err?.status,
        statusCode: err?.statusCode,
        reason: err?.reason,
        details: err?.response?.data ?? err?.data ?? null,
        stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

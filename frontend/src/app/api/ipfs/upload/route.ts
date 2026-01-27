import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata";

// Initialize Pinata v2 SDK with JWT
// v2 SDK supports JWT authentication
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
});

export async function POST(request: NextRequest) {
  // 🕵️ DEBUG: Check which env vars are present
  console.log("=== PINATA ENV VAR CHECK ===");
  console.log("PINATA_JWT present?", Boolean(process.env.PINATA_JWT));
  if (process.env.PINATA_JWT) {
    console.log("PINATA_JWT first 10 chars:", process.env.PINATA_JWT.substring(0, 10) + "...");
  }
  console.log("===========================");
  
  if (!process.env.PINATA_JWT) {
    return NextResponse.json(
      {
        error: "Pinata not configured",
        message: "Missing PINATA_JWT in environment variables",
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
      
      // Pinata v2 SDK accepts File objects directly
      const result = await pinata.upload.file(file);
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
      
      const result = await pinata.upload.json(metadata);
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

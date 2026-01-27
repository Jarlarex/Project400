import { NextRequest, NextResponse } from "next/server";

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
      // Upload file (image) using direct REST API
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      console.log("Uploading file to Pinata:", file.name, file.type, file.size);
      
      // Create FormData for Pinata REST API
      const pinataFormData = new FormData();
      pinataFormData.append("file", file);
      
      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      pinataFormData.append("pinataOptions", pinataOptions);

      // Direct REST API call to Pinata
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: pinataFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("File uploaded successfully, CID:", result.IpfsHash);
      
      return NextResponse.json({ cid: result.IpfsHash });
    } else if (type === "json") {
      // Upload JSON metadata using direct REST API
      const jsonData = formData.get("data") as string;
      if (!jsonData) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
      }

      const metadata = JSON.parse(jsonData);
      console.log("Uploading JSON metadata to Pinata");
      
      // Direct REST API call to Pinata for JSON
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataOptions: {
            cidVersion: 1,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata JSON upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
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

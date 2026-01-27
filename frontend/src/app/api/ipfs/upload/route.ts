import { NextRequest, NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";

// Initialize Pinata with server-side JWT (not exposed to client)
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export async function POST(request: NextRequest) {
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
  } catch (error: any) {
    console.error("IPFS upload error:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to upload to IPFS" },
      { status: 500 }
    );
  }
}

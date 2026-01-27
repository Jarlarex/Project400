import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata";

// Initialize Pinata with server-side JWT (not exposed to client)
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "gateway.pinata.cloud",
});

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
      
      // Convert File to Buffer for Pinata SDK v2
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a new File object with the buffer
      const uploadFile = new File([buffer], file.name, { type: file.type });
      
      const result = await pinata.upload.file(uploadFile);
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
  } catch (error: any) {
    console.error("IPFS upload error:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to upload to IPFS" },
      { status: 500 }
    );
  }
}

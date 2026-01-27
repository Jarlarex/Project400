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

      const result = await pinata.upload.file(file);
      return NextResponse.json({ cid: result.cid });
    } else if (type === "json") {
      // Upload JSON metadata
      const jsonData = formData.get("data") as string;
      if (!jsonData) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
      }

      const metadata = JSON.parse(jsonData);
      const result = await pinata.upload.json(metadata);
      return NextResponse.json({ cid: result.cid });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("IPFS upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload to IPFS" },
      { status: 500 }
    );
  }
}

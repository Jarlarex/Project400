import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const pinataFormData = new FormData();
      pinataFormData.append("file", file);

      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      pinataFormData.append("pinataOptions", pinataOptions);

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
      return NextResponse.json({ cid: result.IpfsHash });
    } else if (type === "json") {
      const jsonData = formData.get("data") as string;
      if (!jsonData) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 });
      }

      const metadata = JSON.parse(jsonData);

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
      return NextResponse.json({ cid: result.IpfsHash });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Failed to upload to IPFS",
        message: err?.message,
      },
      { status: 500 }
    );
  }
}

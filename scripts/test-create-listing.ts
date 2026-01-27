import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b"; // New escrow contract
  
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(contractAddress);

  console.log("Testing createListing on:", contractAddress);
  console.log("");

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const totalBefore = await marketplace.getTotalListings();
  console.log("Total listings before:", totalBefore.toString());

  console.log("\nCreating test listing...");
  const tx = await marketplace.createListing(
    "ipfs://test123",
    ethers.parseEther("0.001"),
    false,
    0
  );
  
  console.log("Transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed!");
  console.log("Logs count:", receipt?.logs.length);

  const totalAfter = await marketplace.getTotalListings();
  console.log("\nTotal listings after:", totalAfter.toString());

  if (totalAfter > totalBefore) {
    console.log("✓ Listing created successfully!");
    const listingId = totalBefore;
    const listing = await marketplace.getListing(listingId);
    console.log("\nListing details:");
    console.log("  ID:", listing.id.toString());
    console.log("  Seller:", listing.seller);
    console.log("  Metadata:", listing.metadataURI);
    console.log("  Price:", ethers.formatEther(listing.price), "ETH");
  } else {
    console.log("✗ Listing was NOT created!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

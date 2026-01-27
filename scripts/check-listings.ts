import { ethers } from "hardhat";

async function main() {
  // Get the deployed marketplace address
  const marketplaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Attach to the deployed contract
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(marketplaceAddress);

  console.log("Connected to Marketplace at:", marketplaceAddress);
  console.log("");

  // Get total listings
  const totalListings = await marketplace.getTotalListings();
  console.log("Total listings:", totalListings.toString());
  console.log("");

  // Get active listings
  const activeListings = await marketplace.getActiveListings();
  console.log("Active listing IDs:", activeListings.map((id: bigint) => id.toString()));
  console.log("");

  // Get details of each listing
  for (let i = 0; i < totalListings; i++) {
    try {
      const listing = await marketplace.getListing(i);
      console.log(`Listing #${i}:`);
      console.log("  Seller:", listing.seller);
      console.log("  Price:", ethers.formatEther(listing.price), "ETH");
      console.log("  Type:", listing.listingType === 0 ? "Fixed Price" : "Auction");
      console.log("  Status:", ["Active", "Sold", "Cancelled"][listing.status]);
      console.log("  Metadata URI:", listing.metadataURI);
      console.log("");
    } catch (err) {
      console.log(`Listing #${i}: Error fetching`, err);
    }
  }

  // Check the first account's listings
  const [signer] = await ethers.getSigners();
  const userListings = await marketplace.getListingsByUser(signer.address);
  console.log(`Listings by ${signer.address}:`, userListings.map((id: bigint) => id.toString()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

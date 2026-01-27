import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x8955804629C8C891d4E69e2a058c4D878B1b182b";
  
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(contractAddress);

  console.log("Connected to Marketplace at:", contractAddress);
  console.log("");

  try {
    const totalListings = await marketplace.getTotalListings();
    console.log("Total listings:", totalListings.toString());

    const activeListings = await marketplace.getActiveListings();
    console.log("\nActive listing IDs:", activeListings.map((id: bigint) => id.toString()));

    const platformFee = await marketplace.platformFee();
    console.log("\nPlatform fee:", platformFee.toString(), "basis points");
  } catch (error) {
    console.error("Error calling contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

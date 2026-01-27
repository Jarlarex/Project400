import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("Network:", network.name);

  // Deploy Marketplace with 2.5% platform fee (250 basis points)
  const platformFee = 250;
  console.log(`\nDeploying Marketplace with ${platformFee / 100}% platform fee...`);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(platformFee);

  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();

  console.log("Marketplace deployed to:", marketplaceAddress);

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    contracts: {
      Marketplace: {
        address: marketplaceAddress,
        platformFee: platformFee,
      },
    },
    timestamp: new Date().toISOString(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to JSON file
  const deploymentPath = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${deploymentPath}`);

  // Copy ABI to frontend
  const frontendLibDir = path.join(__dirname, "../frontend/src/lib/contracts");
  if (!fs.existsSync(frontendLibDir)) {
    fs.mkdirSync(frontendLibDir, { recursive: true });
  }

  // Copy Marketplace ABI
  const marketplaceArtifact = await ethers.getContractFactory("Marketplace");
  const abi = JSON.parse(marketplaceArtifact.interface.formatJson());

  const frontendContractInfo = {
    address: marketplaceAddress,
    chainId: network.config.chainId,
    abi: abi,
  };

  fs.writeFileSync(
    path.join(frontendLibDir, "Marketplace.json"),
    JSON.stringify(frontendContractInfo, null, 2)
  );
  console.log("ABI copied to frontend");

  // Verify on Etherscan if not local network
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nWaiting for block confirmations before verification...");
    // Wait for a few block confirmations
    const receipt = await marketplace.deploymentTransaction()?.wait(5);

    console.log("Verifying contract on Etherscan...");
    try {
      const { run } = await import("hardhat");
      await run("verify:verify", {
        address: marketplaceAddress,
        constructorArguments: [platformFee],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("Contract already verified!");
      } else {
        console.error("Verification failed:", error.message);
      }
    }
  }

  console.log("\n=== Deployment Complete ===");
  console.log(`Marketplace: ${marketplaceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

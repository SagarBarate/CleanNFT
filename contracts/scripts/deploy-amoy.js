const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying RecyclingNFT contract to Amoy testnet...");

  // Get the contract factory
  const RecyclingNFT = await ethers.getContractFactory("RecyclingNFT");

  // Deploy the contract with constructor parameters
  const recyclingNFT = await RecyclingNFT.deploy(
    "Recycling Badge NFT",  // name
    "RBN",                  // symbol
    1000                    // maxClaimableNFTs
  );

  // Wait for deployment to complete
  await recyclingNFT.waitForDeployment();

  const contractAddress = await recyclingNFT.getAddress();
  console.log("✅ RecyclingNFT deployed to:", contractAddress);
  console.log("🔗 View on Amoy Explorer: https://amoy.polygonscan.com/address/" + contractAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: "Amoy Testnet",
    contractAddress: contractAddress,
    deployer: await recyclingNFT.runner.getAddress(),
    timestamp: new Date().toISOString(),
    explorer: `https://amoy.polygonscan.com/address/${contractAddress}`
  };

  console.log("\n📋 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for verification
  console.log("\n🔍 To verify the contract on Amoy Explorer:");
  console.log(`npx hardhat verify --network amoy ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

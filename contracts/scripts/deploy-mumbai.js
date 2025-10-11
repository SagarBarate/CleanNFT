const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying RecyclingNFT contract to Mumbai testnet...");

  // Get the contract factory
  const RecyclingNFT = await ethers.getContractFactory("RecyclingNFT");

  // Contract parameters
  const name = "Recycling Rewards NFT";
  const symbol = "RRNFT";
  const maxClaimableNFTs = 1000; // Maximum NFTs that can be claimed

  // Deploy the contract
  const recyclingNFT = await RecyclingNFT.deploy(name, symbol, maxClaimableNFTs);

  // Wait for deployment to finish
  await recyclingNFT.waitForDeployment();

  const contractAddress = await recyclingNFT.getAddress();

  console.log("RecyclingNFT deployed to:", contractAddress);
  console.log("Contract name:", name);
  console.log("Contract symbol:", symbol);
  console.log("Max claimable NFTs:", maxClaimableNFTs.toString());

  // Verify the deployment
  console.log("\nVerifying deployment...");
  console.log("Owner:", await recyclingNFT.owner());
  console.log("Total minted NFTs:", (await recyclingNFT.getTotalMintedNFTs()).toString());
  console.log("Remaining claimable NFTs:", (await recyclingNFT.getRemainingClaimableNFTs()).toString());

  console.log("\nDeployment successful! 🎉");
  console.log("Contract address:", contractAddress);
  console.log("Network: Mumbai Testnet");
  console.log("Explorer: https://mumbai.polygonscan.com/address/" + contractAddress);

  // Save deployment info to a file
  const fs = require('fs');
  const deploymentInfo = {
    contractName: "RecyclingNFT",
    contractAddress: contractAddress,
    network: "Mumbai Testnet",
    chainId: 80001,
    name: name,
    symbol: symbol,
    maxClaimableNFTs: maxClaimableNFTs,
    deploymentTime: new Date().toISOString(),
    explorer: `https://mumbai.polygonscan.com/address/${contractAddress}`
  };

  fs.writeFileSync(
    'deployment-info-mumbai.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to: deployment-info-mumbai.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

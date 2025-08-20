const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RecyclingBadge contract to Mumbai testnet...");

  // Get the contract factory
  const RecyclingBadge = await ethers.getContractFactory("RecyclingBadge");
  
  console.log("📝 Contract factory created");

  // Deploy the contract
  const recyclingBadge = await RecyclingBadge.deploy();
  
  console.log("⏳ Waiting for deployment...");
  
  // Wait for deployment to finish
  await recyclingBadge.waitForDeployment();
  
  // Get the deployed contract address
  const address = await recyclingBadge.getAddress();
  
  console.log("✅ RecyclingBadge deployed successfully!");
  console.log("📍 Contract Address:", address);
  console.log("🔗 Mumbai Polygonscan:", `https://mumbai.polygonscan.com/address/${address}`);
  
  // Verify the deployment
  console.log("\n🔍 Verifying deployment...");
  
  try {
    // Check if we can call a view function
    const totalSupply = await recyclingBadge.getTotalSupply();
    const nextTokenId = await recyclingBadge.getNextTokenId();
    
    console.log("✅ Contract verification successful!");
    console.log("📊 Total Supply:", totalSupply.toString());
    console.log("🆔 Next Token ID:", nextTokenId.toString());
    
  } catch (error) {
    console.log("⚠️ Contract verification failed:", error.message);
  }
  
  console.log("\n🎯 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your frontend configuration");
  console.log("3. Test the contract on Mumbai testnet");
  console.log("4. Get MATIC from the faucet if needed");
  
  return address;
}

// Handle errors
main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

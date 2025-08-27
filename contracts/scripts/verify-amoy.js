const { run } = require("hardhat");

async function main() {
  // Get contract address from command line argument or environment
  const contractAddress = process.argv[2] || process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Please provide contract address as argument:");
    console.log("Usage: npx hardhat run scripts/verify-amoy.js --network amoy <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log(`Verifying contract at address: ${contractAddress}`);

  try {
    await run("verify:verify", {
      address: contractAddress,
      network: "amoy",
    });
    
    console.log("✅ Contract verified successfully!");
    console.log(`🔗 View on Amoy Explorer: https://amoy.polygonscan.com/address/${contractAddress}`);
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
      console.log(`🔗 View on Amoy Explorer: https://amoy.polygonscan.com/address/${contractAddress}`);
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  });

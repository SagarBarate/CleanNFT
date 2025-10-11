const { ethers } = require("hardhat");

async function main() {
  // Contract address from deployment
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  console.log("🔍 Verifying contract on Mumbai testnet...");
  console.log("📍 Contract Address:", contractAddress);

  try {
    // Get signer
    const [signer] = await ethers.getSigners();
    console.log("👤 Signer:", signer.address);

    // Get contract instance
    const RecyclingBadge = await ethers.getContractFactory("RecyclingBadge");
    const contract = RecyclingBadge.attach(contractAddress);

    console.log("\n📋 Contract Details:");
    console.log("Name:", await contract.name());
    console.log("Symbol:", await contract.symbol());
    console.log("Owner:", await contract.owner());
    console.log("Total Supply:", (await contract.getTotalSupply()).toString());
    console.log("Next Token ID:", (await contract.getNextTokenId()).toString());

    // Test basic functionality
    console.log("\n🧪 Testing Basic Functionality:");

    // Test minting (only owner can mint)
    if (await contract.owner() === signer.address) {
      console.log("✅ Owner verification passed");
      
      const testTokenURI = "ipfs://QmTestVerification123";
      console.log("🎨 Testing mint with URI:", testTokenURI);

      try {
        const tx = await contract.mintBadge(signer.address, testTokenURI);
        console.log("⏳ Minting transaction sent:", tx.hash);
        
        await tx.wait();
        console.log("✅ Minting successful!");
        
        // Verify the mint
        const totalSupply = await contract.getTotalSupply();
        const lastTokenId = totalSupply - 1;
        const owner = await contract.ownerOf(lastTokenId);
        const uri = await contract.tokenURI(lastTokenId);
        
        console.log("📊 Verification Results:");
        console.log("  - Total Supply:", totalSupply.toString());
        console.log("  - Last Token ID:", lastTokenId.toString());
        console.log("  - Owner:", owner);
        console.log("  - Token URI:", uri);
        
        if (owner === signer.address && uri === testTokenURI) {
          console.log("✅ All verifications passed!");
        } else {
          console.log("❌ Verification failed!");
        }
        
      } catch (error) {
        console.error("❌ Minting test failed:", error.message);
      }
    } else {
      console.log("⚠️ Current signer is not the contract owner");
      console.log("   Owner:", await contract.owner());
      console.log("   Signer:", signer.address);
    }

    // Check network
    const network = await ethers.provider.getNetwork();
    console.log("\n🌐 Network Information:");
    console.log("Chain ID:", network.chainId);
    console.log("Network Name:", network.name || "Unknown");
    
    if (network.chainId === 80001n) {
      console.log("✅ Connected to Mumbai testnet");
    } else {
      console.log("⚠️ Not connected to Mumbai testnet");
    }

    // Get gas price
    const gasPrice = await ethers.provider.getFeeData();
    console.log("⛽ Current Gas Price:", ethers.formatUnits(gasPrice.gasPrice || 0, "gwei"), "gwei");

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    
    if (error.message.includes("contract not deployed")) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Check if contract address is correct");
      console.log("2. Ensure contract is deployed to Mumbai testnet");
      console.log("3. Verify network connection");
    }
  }
}

main()
  .then(() => {
    console.log("\n🎉 Verification completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

async function main() {
  const rpcUrls = [
    "https://polygon-mumbai.g.alchemy.com/v2/demo",
    "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    "https://mumbai.maticvigil.com",
    "https://rpc-mumbai.maticvigil.com",
    "https://polygon-mumbai.blockpi.network/v1/rpc/public",
    "https://endpoints.omniatech.io/v1/matic/mumbai/public"
  ];

  console.log("🧪 Testing Mumbai RPC endpoints...\n");

  for (let i = 0; i < rpcUrls.length; i++) {
    const rpcUrl = rpcUrls[i];
    console.log(`Testing ${i + 1}/${rpcUrls.length}: ${rpcUrl}`);
    
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      
      // Test basic connection
      const blockNumber = await provider.getBlockNumber();
      const network = await provider.getNetwork();
      
      console.log(`  ✅ Connected! Block: ${blockNumber}, Chain ID: ${network.chainId}`);
      
      // Check if it's actually Mumbai
      if (network.chainId === 80001n) {
        console.log(`  🎯 This is Mumbai testnet!`);
        
        // Test gas price
        try {
          const gasPrice = await provider.getFeeData();
          console.log(`  ⛽ Gas Price: ${ethers.formatUnits(gasPrice.gasPrice || 0, "gwei")} gwei`);
        } catch (gasError) {
          console.log(`  ⚠️ Could not get gas price: ${gasError.message}`);
        }
        
        console.log(`  🚀 Use this RPC URL: ${rpcUrl}\n`);
        return rpcUrl;
      } else {
        console.log(`  ❌ Wrong network: Expected 80001, got ${network.chainId}\n`);
      }
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log("❌ No working Mumbai RPC endpoints found!");
  return null;
}

main()
  .then((workingRpc) => {
    if (workingRpc) {
      console.log("🎉 Found working RPC endpoint!");
      console.log("📝 Update your .env file with:");
      console.log(`MUMBAI_RPC=${workingRpc}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });

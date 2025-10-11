const https = require('https');

async function testRpcEndpoint(url) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_chainId',
      params: [],
      id: 1
    });

    const options = {
      hostname: new URL(url).hostname,
      port: 443,
      path: new URL(url).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.result) {
            const chainId = parseInt(response.result, 16);
            resolve({ success: true, chainId, response });
          } else {
            resolve({ success: false, error: 'Invalid response' });
          }
        } catch (e) {
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const rpcUrls = [
    "https://polygon-mumbai.g.alchemy.com/v2/demo",
    "https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    "https://polygon-mumbai.blockpi.network/v1/rpc/public",
    "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    "https://rpc.ankr.com/polygon_mumbai",
    "https://polygon-testnet.public.blastapi.io"
  ];

  console.log("🧪 Testing Mumbai RPC endpoints...\n");

  for (let i = 0; i < rpcUrls.length; i++) {
    const rpcUrl = rpcUrls[i];
    console.log(`Testing ${i + 1}/${rpcUrls.length}: ${rpcUrl}`);
    
    try {
      const result = await testRpcEndpoint(rpcUrl);
      
      if (result.success) {
        console.log(`  ✅ Connected! Chain ID: ${result.chainId}`);
        
        if (result.chainId === 80001) {
          console.log(`  🎯 This is Mumbai testnet!`);
          console.log(`  🚀 Use this RPC URL: ${rpcUrl}\n`);
          
          // Test one more method to confirm it's working
          console.log(`  🔍 Testing additional methods...`);
          await testAdditionalMethods(rpcUrl);
          
          return rpcUrl;
        } else {
          console.log(`  ❌ Wrong network: Expected 80001, got ${result.chainId}\n`);
        }
      } else {
        console.log(`  ❌ Failed: ${result.error}\n`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log("❌ No working Mumbai RPC endpoints found!");
  return null;
}

async function testAdditionalMethods(rpcUrl) {
  const methods = [
    { method: 'eth_blockNumber', name: 'Block Number' },
    { method: 'eth_gasPrice', name: 'Gas Price' }
  ];

  for (const { method, name } of methods) {
    try {
      const result = await testRpcEndpoint(rpcUrl, method);
      if (result.success) {
        console.log(`    ✅ ${name}: Working`);
      } else {
        console.log(`    ⚠️ ${name}: ${result.error}`);
      }
    } catch (error) {
      console.log(`    ❌ ${name}: ${error.message}`);
    }
  }
}

async function testRpcEndpoint(url, method = 'eth_chainId') {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: [],
      id: 1
    });

    const options = {
      hostname: new URL(url).hostname,
      port: 443,
      path: new URL(url).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.result) {
            resolve({ success: true, result: response.result });
          } else {
            resolve({ success: false, error: 'Invalid response' });
          }
        } catch (e) {
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

main()
  .then((workingRpc) => {
    if (workingRpc) {
      console.log("\n🎉 Found working RPC endpoint!");
      console.log("📝 Update your .env file with:");
      console.log(`MUMBAI_RPC=${workingRpc}`);
      console.log("\nThen try deployment again:");
      console.log("npm run deploy:mumbai");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });


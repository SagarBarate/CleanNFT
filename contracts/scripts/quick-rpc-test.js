const https = require('https');

function testRpc(url) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
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
        'Content-Length': data.length
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (result.result) {
            const chainId = parseInt(result.result, 16);
            resolve({ success: true, chainId, url });
          } else {
            resolve({ success: false, error: 'No result', url });
          }
        } catch (e) {
          resolve({ success: false, error: 'Invalid JSON', url });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message, url });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout', url });
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  const endpoints = [
    'https://rpc.ankr.com/polygon_mumbai',
    'https://polygon-mumbai.blockpi.network/v1/rpc/public',
    'https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    'https://endpoints.omniatech.io/v1/matic/mumbai/public',
    'https://polygon-testnet.public.blastapi.io'
  ];

  console.log('🧪 Testing Mumbai RPC endpoints...\n');

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    
    try {
      const result = await testRpc(endpoint);
      
      if (result.success && result.chainId === 80001) {
        console.log(`  ✅ SUCCESS! Chain ID: ${result.chainId} (Mumbai testnet)`);
        console.log(`  🚀 Use this RPC: ${endpoint}\n`);
        
        console.log('📝 Update your .env file with:');
        console.log(`MUMBAI_RPC=${endpoint}`);
        console.log('\nThen deploy with: npm run deploy:mumbai');
        
        return endpoint;
      } else if (result.success) {
        console.log(`  ⚠️  Connected but wrong network: Chain ID ${result.chainId} (expected 80001)`);
      } else {
        console.log(`  ❌ Failed: ${result.error}`);
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
    }
    
    console.log('');
  }
  
  console.log('❌ No working Mumbai endpoints found!');
  return null;
}

main().catch(console.error);


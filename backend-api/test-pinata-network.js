require('dotenv').config();
const fetch = require('node-fetch');

async function testNetworkConnectivity() {
  console.log('🌐 Testing Network Connectivity to Pinata...\n');
  
  const testUrls = [
    'https://api.pinata.cloud',
    'https://pinata.cloud',
    'https://ipfs.io',
    'https://httpbin.org/get' // Test general internet connectivity
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`🔍 Testing: ${url}`);
      const response = await fetch(url, { 
        method: 'GET',
        timeout: 10000 // 10 second timeout
      });
      console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }
  
  // Test Pinata API specifically
  console.log('🔑 Testing Pinata API Authentication...');
  try {
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
      },
      timeout: 15000
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Pinata API Authentication Successful!');
      console.log('   Response:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.text();
      console.log('   ❌ Pinata API Authentication Failed');
      console.log('   Error Response:', errorData);
    }
    
  } catch (error) {
    console.log(`   ❌ Network Error: ${error.message}`);
    
    // Check if it's a DNS resolution issue
    if (error.code === 'ENOTFOUND') {
      console.log('   💡 This appears to be a DNS resolution issue.');
      console.log('   💡 Possible solutions:');
      console.log('      - Check your internet connection');
      console.log('      - Try using a different DNS server (8.8.8.8 or 1.1.1.1)');
      console.log('      - Check if your firewall/antivirus is blocking the connection');
    }
  }
}

// Run the test
testNetworkConnectivity().catch(console.error);


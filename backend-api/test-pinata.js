require('dotenv').config();
const PinataService = require('./src/services/pinataService');

async function testPinataConnection() {
  console.log('🔍 Testing Pinata Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`PINATA_API_KEY: ${process.env.PINATA_API_KEY ? '✅ Set' : '❌ Not Set'}`);
  console.log(`PINATA_SECRET_KEY: ${process.env.PINATA_SECRET_KEY ? '✅ Set' : '❌ Not Set'}`);
  
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
    console.log('\n❌ Pinata API keys not configured. Please check your .env file.');
    return;
  }
  
  console.log('\n🔑 API Key (first 8 chars):', process.env.PINATA_API_KEY.substring(0, 8) + '...');
  console.log('🔑 Secret Key (first 8 chars):', process.env.PINATA_SECRET_KEY.substring(0, 8) + '...');
  
  try {
    // Initialize Pinata service
    const pinataService = new PinataService();
    
    console.log('\n🔧 Pinata Service Status:');
    console.log(`Configured: ${pinataService.isConfigured() ? '✅ Yes' : '❌ No'}`);
    
    if (!pinataService.isConfigured()) {
      console.log('❌ Pinata service not properly configured.');
      return;
    }
    
    // Test connection
    console.log('\n🌐 Testing Pinata Connection...');
    const connectionTest = await pinataService.testConnection();
    console.log(`Connection Test: ${connectionTest ? '✅ Success' : '❌ Failed'}`);
    
    if (connectionTest) {
      console.log('✅ Pinata connection successful!');
      
      // Test account information
      console.log('\n👤 Getting Account Information...');
      try {
        const accountInfo = await pinataService.getAccountInfo();
        console.log('✅ Account Information Retrieved:');
        console.log(`   Total Pinned: ${accountInfo.pin_count || 'N/A'}`);
        console.log(`   Total Size: ${accountInfo.pin_size_total || 'N/A'}`);
      } catch (error) {
        console.log('⚠️  Could not retrieve account info:', error.message);
      }
      
      // Test metadata upload
      console.log('\n📤 Testing Metadata Upload...');
      try {
        const testMetadata = {
          name: "Test NFT",
          description: "Test NFT for Pinata verification",
          image: "ipfs://test",
          attributes: [
            { trait_type: "Test", value: "Pinata" },
            { trait_type: "Timestamp", value: new Date().toISOString() }
          ]
        };
        
        const uploadResult = await pinataService.uploadMetadata(testMetadata);
        console.log('✅ Metadata Upload Successful!');
        console.log(`   IPFS Hash: ${uploadResult.hash}`);
        console.log(`   IPFS URL: ${uploadResult.url}`);
        
        // Clean up test data (optional)
        console.log('\n🧹 Test completed successfully!');
        
      } catch (error) {
        console.log('❌ Metadata upload failed:', error.message);
      }
      
    } else {
      console.log('❌ Pinata connection failed. Please check your API credentials.');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }
}

// Run the test
testPinataConnection().catch(console.error);

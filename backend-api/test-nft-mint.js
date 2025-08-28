const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testNFTMinting() {
  console.log('🧪 Testing NFT Minting Flow...\n');
  
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Create form data for the mint request
    const form = new FormData();
    form.append('imageFile', testImageBuffer, {
      filename: 'test-nft.png',
      contentType: 'image/png'
    });
    form.append('name', 'Test Recycling NFT #1');
    form.append('description', 'Awarded for recycling 5kg of waste');
    form.append('attributes', JSON.stringify([
      { trait_type: "Weight", value: "5kg" },
      { trait_type: "Category", value: "Recycling" },
      { trait_type: "Achievement", value: "First Time" }
    ]));

    console.log('📤 Minting NFT...');
    console.log('Name: Test Recycling NFT #1');
    console.log('Description: Awarded for recycling 5kg of waste');
    console.log('Attributes: Weight (5kg), Category (Recycling), Achievement (First Time)');

    // Make the mint request
    const response = await fetch('http://localhost:3001/api/nfts/mint', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ NFT Minted Successfully!');
      console.log('Token ID:', result.tokenId);
      console.log('Transaction Hash:', result.transactionHash);
      console.log('IPFS URL:', result.ipfsUrl);
      console.log('\n📋 Metadata:');
      console.log(JSON.stringify(result.metadata, null, 2));
      
      // Store the token ID for claiming test
      fs.writeFileSync('minted-token-id.txt', result.tokenId);
      console.log('\n💾 Token ID saved to minted-token-id.txt for claiming test');
      
    } else {
      console.log('\n❌ NFT Minting Failed:');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testNFTMinting();

require('dotenv').config();
const BlockchainService = require('./src/services/BlockchainService');

async function testBlockchainConfiguration() {
  console.log('🧪 Testing Blockchain Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('MUMBAI_RPC_URL:', process.env.MUMBAI_RPC_URL ? '✅ Set' : '❌ Missing');
  console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS ? '✅ Set' : '❌ Missing');
  console.log('ADMIN_PRIVATE_KEY:', process.env.ADMIN_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log('PINATA_API_KEY:', process.env.PINATA_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('PINATA_SECRET_KEY:', process.env.PINATA_SECRET_KEY ? '✅ Set' : '❌ Missing');
  
  // Check if all required variables are set
  const requiredVars = ['MUMBAI_RPC_URL', 'CONTRACT_ADDRESS', 'ADMIN_PRIVATE_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('\n❌ Missing required environment variables:', missingVars.join(', '));
    console.log('\n📝 Please create a .env file with the following variables:');
    console.log('MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com');
    console.log('CONTRACT_ADDRESS=your_deployed_contract_address');
    console.log('ADMIN_PRIVATE_KEY=your_admin_wallet_private_key');
    console.log('PINATA_API_KEY=your_pinata_api_key');
    console.log('PINATA_SECRET_KEY=your_pinata_secret_key');
    return;
  }
  
  console.log('\n✅ All required environment variables are set!');
  
  // Test blockchain service
  try {
    console.log('\n🔗 Testing Blockchain Service...');
    const blockchainService = new BlockchainService();
    
    // Test initialization
    console.log('Initializing blockchain service...');
    await blockchainService.initializeBlockchain();
    
    // Test network info
    console.log('Getting network info...');
    const networkInfo = await blockchainService.getNetworkInfo();
    console.log('Network:', networkInfo);
    
    // Test admin balance
    console.log('Getting admin balance...');
    const adminBalance = await blockchainService.getAdminBalance();
    console.log('Admin Balance:', adminBalance, 'MATIC');
    
    // Test contract connection
    console.log('Testing contract connection...');
    const contractTest = await blockchainService.testContractConnection();
    console.log('Contract Test:', contractTest);
    
    console.log('\n🎉 All tests passed! Blockchain service is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Blockchain service test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testBlockchainConfiguration().catch(console.error);

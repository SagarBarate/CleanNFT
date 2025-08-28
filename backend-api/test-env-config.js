// Test Environment Configuration
// This script tests if the .env file is properly configured

require('dotenv').config();
const { ethers } = require('ethers');

console.log('🔍 Testing Environment Configuration...\n');

// Test 1: Check if required environment variables are loaded
console.log('📋 Environment Variables Check:');
const requiredVars = [
  'PORT',
  'NODE_ENV', 
  'MUMBAI_RPC_URL',
  'CONTRACT_ADDRESS',
  'ADMIN_PRIVATE_KEY',
  'PINATA_API_KEY',
  'PINATA_SECRET_KEY',
  'JWT_SECRET'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'your_admin_wallet_private_key_here' && 
      value !== 'your_pinata_api_key_here' && 
      value !== 'your_pinata_secret_key_here' &&
      value !== 'your_jwt_secret_key_here_change_this_in_production') {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Not configured or using placeholder`);
    allVarsPresent = false;
  }
});

console.log('\n🔗 Blockchain Connection Test:');

// Test 2: Test Mumbai RPC connection
async function testBlockchainConnection() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test getting latest block
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Latest block number: ${blockNumber}`);
    
    return true;
  } catch (error) {
    console.log(`❌ Blockchain connection failed: ${error.message}`);
    return false;
  }
}

// Test 3: Test wallet creation from private key
async function testWalletCreation() {
  try {
    if (process.env.ADMIN_PRIVATE_KEY && 
        process.env.ADMIN_PRIVATE_KEY !== 'your_admin_wallet_private_key_here') {
      const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY);
      console.log(`✅ Wallet created successfully`);
      console.log(`   Address: ${wallet.address}`);
      
      // Test connecting wallet to provider
      const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
      const connectedWallet = wallet.connect(provider);
      const balance = await connectedWallet.provider.getBalance(wallet.address);
      console.log(`   Balance: ${ethers.formatEther(balance)} MATIC`);
      
      return true;
    } else {
      console.log(`❌ Admin private key not configured`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Wallet creation failed: ${error.message}`);
    return false;
  }
}

// Test 4: Test contract address format
function testContractAddress() {
  try {
    if (process.env.CONTRACT_ADDRESS && 
        process.env.CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      // Check if it's a valid Ethereum address
      if (ethers.isAddress(process.env.CONTRACT_ADDRESS)) {
        console.log(`✅ Contract address is valid: ${process.env.CONTRACT_ADDRESS}`);
        return true;
      } else {
        console.log(`❌ Contract address format is invalid: ${process.env.CONTRACT_ADDRESS}`);
        return false;
      }
    } else {
      console.log(`⚠️  Contract address not configured (using placeholder)`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Contract address validation failed: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Running Tests...\n');
  
  const blockchainTest = await testBlockchainConnection();
  const walletTest = await testWalletCreation();
  const contractTest = testContractAddress();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Environment Variables: ${allVarsPresent ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Blockchain Connection: ${blockchainTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Wallet Creation: ${walletTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Contract Address: ${contractTest ? '✅ PASS' : '⚠️  NOT CONFIGURED'}`);
  
  if (allVarsPresent && blockchainTest && walletTest) {
    console.log('\n🎉 Environment configuration is ready!');
    console.log('You can proceed to Step 3: Update Backend Blockchain Service');
  } else {
    console.log('\n⚠️  Please fix the configuration issues above before proceeding');
  }
}

runTests().catch(console.error);

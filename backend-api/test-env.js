// Test environment configuration for backend API
// This file is for testing purposes only

// Mock environment variables for testing
process.env.PORT = 3002;
process.env.NODE_ENV = 'test';
process.env.MUMBAI_RPC_URL = 'https://rpc-mumbai.maticvigil.com';
process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Mock address
process.env.ADMIN_PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000'; // Mock key
process.env.PINATA_API_KEY = 'test_api_key';
process.env.PINATA_SECRET_KEY = 'test_secret_key';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.APP_WEBSITE = 'https://test.com';

console.log('Test environment loaded successfully');
console.log('Mock contract address:', process.env.CONTRACT_ADDRESS);
console.log('Mock admin private key:', process.env.ADMIN_PRIVATE_KEY);
console.log('Mock Pinata API key:', process.env.PINATA_API_KEY);

module.exports = {
  testEnv: true
};

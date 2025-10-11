// Frontend Pinata Configuration Test
// This script tests the frontend Pinata configuration

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config();

console.log('🔍 Testing Frontend Pinata Configuration...\n');

console.log('🖥️  Node.js Environment Detected');

console.log('📋 Environment Variables:');
console.log(`REACT_APP_PINATA_API_KEY: ${process.env.REACT_APP_PINATA_API_KEY ? '✅ Set' : '❌ Not Set'}`);
console.log(`REACT_APP_PINATA_SECRET_KEY: ${process.env.REACT_APP_PINATA_SECRET_KEY ? '✅ Set' : '❌ Not Set'}`);

if (process.env.REACT_APP_PINATA_API_KEY && process.env.REACT_APP_PINATA_SECRET_KEY) {
  console.log('\n🔑 API Key (first 8 chars):', process.env.REACT_APP_PINATA_API_KEY.substring(0, 8) + '...');
  console.log('🔑 Secret Key (first 8 chars):', process.env.REACT_APP_PINATA_SECRET_KEY.substring(0, 8) + '...');
  
  // Test Pinata API call
  console.log('\n🌐 Testing Frontend Pinata API Call...');
  
  try {
    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers: {
        'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_KEY
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Frontend Pinata API Test Successful!');
      console.log('Response:', data);
    } else {
      console.log('❌ Frontend Pinata API Test Failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Frontend Pinata API Test Failed:', error.message);
  }
  
} else {
  console.log('❌ Pinata API keys not configured in frontend environment.');
}

console.log('\n📱 Frontend Configuration Test Complete!');
console.log('\n💡 Note: Frontend Pinata operations should be done through the backend API');
console.log('   for security reasons. Direct frontend calls are for testing only.');

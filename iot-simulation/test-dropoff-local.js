// Local drop-off simulation test (no MQTT required)
const EdgeProcessor = require('./edge-compute/edgeProcessor');

async function testDropOffLocal() {
  const edgeProcessor = new EdgeProcessor();
  
  try {
    console.log('🎯 Testing drop-off simulation (local mode)...');
    
    // Set device location
    edgeProcessor.setDeviceLocation(40.7829, -73.9654); // Central Park
    
    // Simulate multiple drop-off events
    console.log('\n📦 Simulating drop-off events...');
    
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Drop-off Event ${i} ---`);
      const dropOffEvent = edgeProcessor.simulateDropOff();
      
      console.log('Event Details:');
      console.log(`  Device ID: ${dropOffEvent.deviceId}`);
      console.log(`  Weight Change: ${dropOffEvent.data.weight.change} ${dropOffEvent.data.weight.unit}`);
      console.log(`  Location: ${dropOffEvent.data.location.latitude}, ${dropOffEvent.data.location.longitude}`);
      console.log(`  Fill Level Change: ${dropOffEvent.data.fillLevel.change}%`);
      console.log(`  Confidence: ${(dropOffEvent.data.confidence * 100).toFixed(1)}%`);
      
      // Wait 1 second between events
      if (i < 3) {
        console.log('⏳ Waiting 1 second before next event...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n✅ Local drop-off simulation completed successfully!');
    
    // Test device status
    console.log('\n📊 Device Status:');
    const status = edgeProcessor.getDeviceStatus();
    console.log(JSON.stringify(status, null, 2));
    
  } catch (error) {
    console.error('❌ Local simulation failed:', error);
  }
}

// Run the local test
testDropOffLocal();

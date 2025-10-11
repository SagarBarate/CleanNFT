// Standalone drop-off simulation script
const IoTSimulation = require('./index');

async function simulateDropOff() {
  const simulation = new IoTSimulation();
  
  try {
    console.log('🎯 Starting drop-off simulation...');
    
    // Initialize the simulation
    await simulation.initialize();
    
    // Set device location (optional)
    simulation.setDeviceLocation(40.7829, -73.9654); // Central Park
    
    // Simulate multiple drop-off events
    console.log('\n📦 Simulating drop-off events...');
    
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Drop-off Event ${i} ---`);
      const dropOffEvent = await simulation.simulateDropOff();
      
      console.log('Event Details:');
      console.log(`  Device ID: ${dropOffEvent.deviceId}`);
      console.log(`  Weight Change: ${dropOffEvent.data.weight.change} ${dropOffEvent.data.weight.unit}`);
      console.log(`  Location: ${dropOffEvent.data.location.latitude}, ${dropOffEvent.data.location.longitude}`);
      console.log(`  Fill Level Change: ${dropOffEvent.data.fillLevel.change}%`);
      console.log(`  Confidence: ${(dropOffEvent.data.confidence * 100).toFixed(1)}%`);
      
      // Wait 2 seconds between events
      if (i < 3) {
        console.log('⏳ Waiting 2 seconds before next event...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n✅ Drop-off simulation completed successfully!');
    
  } catch (error) {
    console.error('❌ Simulation failed:', error);
  } finally {
    simulation.cleanup();
  }
}

// Run the simulation
simulateDropOff();

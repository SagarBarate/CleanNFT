// Main IoT Edge Layer Simulation (Local Version - No MQTT Required)
const EdgeProcessor = require('./edge-compute/edgeProcessor');

class IoTSimulationLocal {
  constructor() {
    this.edgeProcessor = new EdgeProcessor();
    this.isRunning = false;
    this.intervalId = null;
  }

  // Initialize the IoT simulation (local mode)
  async initialize() {
    try {
      console.log('🚀 Initializing IoT Edge Layer Simulation (Local Mode)...');
      console.log('✅ IoT Simulation initialized successfully (No MQTT required)');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize IoT simulation:', error);
      return false;
    }
  }

  // Start continuous sensor monitoring (local mode)
  startMonitoring(intervalMs = 5000) {
    if (this.isRunning) {
      console.log('⚠️ Monitoring is already running');
      return;
    }

    console.log(`📡 Starting sensor monitoring (interval: ${intervalMs}ms) - Local Mode`);
    this.isRunning = true;

    this.intervalId = setInterval(async () => {
      try {
        const sensorData = await this.edgeProcessor.processSensorData();
        
        if (sensorData.type === 'drop_off_event') {
          // Log drop-off event locally
          console.log('🎯 Drop-off Event Detected:');
          console.log(`  Device ID: ${sensorData.deviceId}`);
          console.log(`  Weight Change: ${sensorData.data.weight.change} ${sensorData.data.weight.unit}`);
          console.log(`  Location: ${sensorData.data.location.latitude}, ${sensorData.data.location.longitude}`);
          console.log(`  Fill Level Change: ${sensorData.data.fillLevel.change}%`);
          console.log(`  Confidence: ${(sensorData.data.confidence * 100).toFixed(1)}%`);
          console.log('📤 [Local Mode] Event would be sent to MQTT in production');
        } else {
          // Log regular sensor data locally
          console.log('📊 Sensor Data:');
          console.log(`  Weight: ${sensorData.data.weight.weight} ${sensorData.data.weight.unit}`);
          console.log(`  Location: ${sensorData.data.location.latitude}, ${sensorData.data.location.longitude}`);
          console.log(`  Fill Level: ${sensorData.data.fillLevel.fillPercentage}%`);
        }
      } catch (error) {
        console.error('Error in monitoring loop:', error);
      }
    }, intervalMs);
  }

  // Stop continuous monitoring
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Stopped sensor monitoring');
  }

  // Simulate a single drop-off event (local mode)
  async simulateDropOff() {
    try {
      console.log('🎯 Simulating drop-off event (Local Mode)...');
      
      const dropOffEvent = this.edgeProcessor.simulateDropOff();
      
      console.log('✅ Drop-off event simulated successfully');
      console.log('Event Details:');
      console.log(`  Device ID: ${dropOffEvent.deviceId}`);
      console.log(`  Weight Change: ${dropOffEvent.data.weight.change} ${dropOffEvent.data.weight.unit}`);
      console.log(`  Location: ${dropOffEvent.data.location.latitude}, ${dropOffEvent.data.location.longitude}`);
      console.log(`  Fill Level Change: ${dropOffEvent.data.fillLevel.change}%`);
      console.log(`  Confidence: ${(dropOffEvent.data.confidence * 100).toFixed(1)}%`);
      console.log('📤 [Local Mode] Event would be sent to MQTT in production');
      
      return dropOffEvent;
    } catch (error) {
      console.error('❌ Failed to simulate drop-off event:', error);
      throw error;
    }
  }

  // Get device status
  getDeviceStatus() {
    return {
      device: this.edgeProcessor.getDeviceStatus(),
      monitoring: {
        isRunning: this.isRunning,
        intervalId: this.intervalId ? 'active' : null,
        mode: 'local'
      }
    };
  }

  // Set device location for testing
  setDeviceLocation(lat, lng) {
    this.edgeProcessor.setDeviceLocation(lat, lng);
    console.log(`📍 Device location set to: ${lat}, ${lng}`);
  }

  // Cleanup resources
  cleanup() {
    this.stopMonitoring();
    console.log('🧹 IoT Simulation cleaned up');
  }
}

// Export for use in other files
module.exports = IoTSimulationLocal;

// If running directly, start the simulation
if (require.main === module) {
  const simulation = new IoTSimulationLocal();
  
  async function runSimulation() {
    try {
      await simulation.initialize();
      
      // Set a custom location (optional)
      simulation.setDeviceLocation(40.7589, -73.9851); // Times Square
      
      // Start monitoring
      simulation.startMonitoring(3000); // Check every 3 seconds
      
      // Simulate a drop-off after 10 seconds
      setTimeout(async () => {
        await simulation.simulateDropOff();
      }, 10000);
      
      // Stop after 30 seconds
      setTimeout(() => {
        simulation.cleanup();
        process.exit(0);
      }, 30000);
      
    } catch (error) {
      console.error('Simulation failed:', error);
      process.exit(1);
    }
  }
  
  runSimulation();
}

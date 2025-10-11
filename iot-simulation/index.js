// Main IoT Edge Layer Simulation
const EdgeProcessor = require('./edge-compute/edgeProcessor');
const MQTTPublisher = require('./mqtt-publisher/mqttPublisher');

class IoTSimulation {
  constructor() {
    this.edgeProcessor = new EdgeProcessor();
    this.mqttPublisher = new MQTTPublisher();
    this.isRunning = false;
    this.intervalId = null;
  }

  // Initialize the IoT simulation
  async initialize() {
    try {
      console.log('🚀 Initializing IoT Edge Layer Simulation...');
      
      // Connect to MQTT broker
      await this.mqttPublisher.connectToAWSIoT();
      
      console.log('✅ IoT Simulation initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize IoT simulation:', error);
      return false;
    }
  }

  // Start continuous sensor monitoring
  startMonitoring(intervalMs = 5000) {
    if (this.isRunning) {
      console.log('⚠️ Monitoring is already running');
      return;
    }

    console.log(`📡 Starting sensor monitoring (interval: ${intervalMs}ms)`);
    this.isRunning = true;

    this.intervalId = setInterval(async () => {
      try {
        const sensorData = await this.edgeProcessor.processSensorData();
        
        if (sensorData.type === 'drop_off_event') {
          // Publish drop-off event
          await this.mqttPublisher.publishDropOffEvent(sensorData);
        } else {
          // Publish regular sensor data for monitoring
          await this.mqttPublisher.publishSensorData(sensorData);
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

  // Simulate a single drop-off event
  async simulateDropOff() {
    try {
      console.log('🎯 Simulating drop-off event...');
      
      const dropOffEvent = this.edgeProcessor.simulateDropOff();
      await this.mqttPublisher.publishDropOffEvent(dropOffEvent);
      
      console.log('✅ Drop-off event simulated successfully');
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
      mqtt: this.mqttPublisher.getConnectionStatus(),
      monitoring: {
        isRunning: this.isRunning,
        intervalId: this.intervalId ? 'active' : null
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
    this.mqttPublisher.disconnect();
    console.log('🧹 IoT Simulation cleaned up');
  }
}

// Export for use in other files
module.exports = IoTSimulation;

// If running directly, start the simulation
if (require.main === module) {
  const simulation = new IoTSimulation();
  
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

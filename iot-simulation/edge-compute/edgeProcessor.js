// Edge Compute Simulation (Raspberry Pi + Greengrass)
const { MockLoadCellSensor, MockGPSSensor, MockUltrasonicSensor } = require('../sensors/mockSensors');

class EdgeProcessor {
  constructor() {
    this.loadCell = new MockLoadCellSensor();
    this.gps = new MockGPSSensor();
    this.ultrasonic = new MockUltrasonicSensor();
    this.deviceId = 'recycling-bin-001';
    this.lastDropOffTime = null;
    this.dropOffThreshold = 0.5; // kg - minimum weight change to trigger drop-off
    this.timeThreshold = 30000; // 30 seconds - minimum time between drop-offs
  }

  // Process all sensor data and determine if drop-off occurred
  async processSensorData() {
    try {
      // Collect data from all sensors
      const weightData = this.loadCell.measureWeight();
      const locationData = this.gps.captureLocation();
      const fillLevelData = this.ultrasonic.measureFillLevel();

      // Check if this is a drop-off event
      const dropOffEvent = this.detectDropOffEvent(weightData, fillLevelData);

      if (dropOffEvent) {
        return this.createDropOffEvent(weightData, locationData, fillLevelData, dropOffEvent);
      }

      // Return regular sensor data (for monitoring)
      return {
        type: 'sensor_data',
        deviceId: this.deviceId,
        timestamp: new Date().toISOString(),
        data: {
          weight: weightData,
          location: locationData,
          fillLevel: fillLevelData
        }
      };

    } catch (error) {
      console.error('Error processing sensor data:', error);
      throw error;
    }
  }

  // Detect if a drop-off event occurred
  detectDropOffEvent(weightData, fillLevelData) {
    const currentTime = Date.now();
    
    // Check if enough time has passed since last drop-off
    if (this.lastDropOffTime && (currentTime - this.lastDropOffTime) < this.timeThreshold) {
      return null;
    }

    // Simulate weight change detection
    const weightChange = Math.random() * 3; // 0-3kg change
    
    if (weightChange > this.dropOffThreshold) {
      this.lastDropOffTime = currentTime;
      
      return {
        weightChange: weightChange.toFixed(2),
        fillLevelChange: (Math.random() * 15 + 5).toFixed(1), // 5-20% fill increase
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      };
    }

    return null;
  }

  // Create a drop-off event payload
  createDropOffEvent(weightData, locationData, fillLevelData, dropOffEvent) {
    return {
      type: 'drop_off_event',
      deviceId: this.deviceId,
      timestamp: new Date().toISOString(),
      eventId: `drop-off-${Date.now()}`,
      data: {
        weight: {
          current: weightData.weight,
          change: dropOffEvent.weightChange,
          unit: weightData.unit
        },
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy
        },
        fillLevel: {
          current: fillLevelData.fillPercentage,
          change: dropOffEvent.fillLevelChange,
          unit: '%'
        },
        confidence: dropOffEvent.confidence,
        sensors: {
          loadCell: weightData.sensorId,
          gps: locationData.sensorId,
          ultrasonic: fillLevelData.sensorId
        }
      }
    };
  }

  // Simulate a manual drop-off event (for testing)
  simulateDropOff() {
    const weightData = this.loadCell.simulateDropOff();
    const locationData = this.gps.captureLocation();
    const fillLevelData = this.ultrasonic.simulateFillChange();

    return this.createDropOffEvent(weightData, locationData, fillLevelData, {
      weightChange: weightData.dropOffWeight,
      fillLevelChange: fillLevelData.fillIncrease,
      confidence: 0.95
    });
  }

  // Set device location for testing
  setDeviceLocation(lat, lng) {
    this.gps.setLocation(lat, lng);
  }

  // Get device status
  getDeviceStatus() {
    return {
      deviceId: this.deviceId,
      status: 'online',
      lastUpdate: new Date().toISOString(),
      sensors: {
        loadCell: 'active',
        gps: 'active',
        ultrasonic: 'active'
      }
    };
  }
}

module.exports = EdgeProcessor;

// Mock Sensors for IoT Edge Simulation
const { v4: uuidv4 } = require('uuid');

class MockLoadCellSensor {
  constructor() {
    this.baseWeight = 0;
    this.currentWeight = 0;
  }

  // Simulate weight measurement
  measureWeight() {
    // Simulate weight between 0.5kg to 10kg
    const weight = Math.random() * 9.5 + 0.5;
    this.currentWeight = weight;
    return {
      weight: weight.toFixed(2),
      unit: 'kg',
      timestamp: new Date().toISOString(),
      sensorId: 'load-cell-001'
    };
  }

  // Simulate weight change (drop-off event)
  simulateDropOff() {
    const previousWeight = this.currentWeight;
    const dropOffWeight = Math.random() * 5 + 1; // 1-6kg drop-off
    this.currentWeight = Math.max(0, this.currentWeight - dropOffWeight);
    
    return {
      previousWeight: previousWeight.toFixed(2),
      dropOffWeight: dropOffWeight.toFixed(2),
      currentWeight: this.currentWeight.toFixed(2),
      unit: 'kg',
      timestamp: new Date().toISOString(),
      eventType: 'drop-off'
    };
  }
}

class MockGPSSensor {
  constructor() {
    // Default location (Central Park, NYC)
    this.defaultLocation = {
      latitude: 40.7829,
      longitude: -73.9654
    };
  }

  // Simulate GPS location capture
  captureLocation() {
    // Add some random variation to simulate GPS accuracy
    const latVariation = (Math.random() - 0.5) * 0.001;
    const lngVariation = (Math.random() - 0.5) * 0.001;
    
    return {
      latitude: (this.defaultLocation.latitude + latVariation).toFixed(6),
      longitude: (this.defaultLocation.longitude + lngVariation).toFixed(6),
      accuracy: Math.random() * 5 + 1, // 1-6 meters accuracy
      timestamp: new Date().toISOString(),
      sensorId: 'gps-001'
    };
  }

  // Set custom location for testing
  setLocation(lat, lng) {
    this.defaultLocation = { latitude: lat, longitude: lng };
  }
}

class MockUltrasonicSensor {
  constructor() {
    this.maxDistance = 100; // cm
    this.currentDistance = 50; // cm
  }

  // Simulate fill-level measurement
  measureFillLevel() {
    // Simulate distance measurement (closer = more full)
    const distance = Math.random() * this.maxDistance;
    this.currentDistance = distance;
    
    const fillPercentage = Math.max(0, 100 - (distance / this.maxDistance) * 100);
    
    return {
      distance: distance.toFixed(1),
      fillPercentage: fillPercentage.toFixed(1),
      unit: 'cm',
      timestamp: new Date().toISOString(),
      sensorId: 'ultrasonic-001'
    };
  }

  // Simulate fill-level change after drop-off
  simulateFillChange() {
    const previousFill = 100 - (this.currentDistance / this.maxDistance) * 100;
    const fillIncrease = Math.random() * 20 + 5; // 5-25% increase
    const newFill = Math.min(100, previousFill + fillIncrease);
    
    this.currentDistance = Math.max(0, this.maxDistance - (newFill / 100) * this.maxDistance);
    
    return {
      previousFill: previousFill.toFixed(1),
      fillIncrease: fillIncrease.toFixed(1),
      currentFill: newFill.toFixed(1),
      timestamp: new Date().toISOString(),
      eventType: 'fill-change'
    };
  }
}

module.exports = {
  MockLoadCellSensor,
  MockGPSSensor,
  MockUltrasonicSensor
};

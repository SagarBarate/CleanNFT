// Test script for IoT sensors
const { MockLoadCellSensor, MockGPSSensor, MockUltrasonicSensor } = require('./sensors/mockSensors');

function testSensors() {
  console.log('🧪 Testing IoT Sensors...\n');
  
  // Test Load Cell Sensor
  console.log('📊 Testing Load Cell Sensor:');
  const loadCell = new MockLoadCellSensor();
  
  for (let i = 0; i < 3; i++) {
    const weightData = loadCell.measureWeight();
    console.log(`  Measurement ${i + 1}: ${weightData.weight} ${weightData.unit}`);
  }
  
  const dropOffData = loadCell.simulateDropOff();
  console.log(`  Drop-off simulation: ${dropOffData.dropOffWeight} ${dropOffData.unit} removed`);
  console.log('');
  
  // Test GPS Sensor
  console.log('📍 Testing GPS Sensor:');
  const gps = new MockGPSSensor();
  
  // Test default location
  for (let i = 0; i < 3; i++) {
    const locationData = gps.captureLocation();
    console.log(`  Location ${i + 1}: ${locationData.latitude}, ${locationData.longitude} (accuracy: ${locationData.accuracy}m)`);
  }
  
  // Test custom location
  gps.setLocation(40.7589, -73.9851); // Times Square
  const customLocation = gps.captureLocation();
  console.log(`  Custom location: ${customLocation.latitude}, ${customLocation.longitude}`);
  console.log('');
  
  // Test Ultrasonic Sensor
  console.log('📏 Testing Ultrasonic Sensor:');
  const ultrasonic = new MockUltrasonicSensor();
  
  for (let i = 0; i < 3; i++) {
    const fillData = ultrasonic.measureFillLevel();
    console.log(`  Measurement ${i + 1}: ${fillData.fillPercentage}% full (distance: ${fillData.distance}${fillData.unit})`);
  }
  
  const fillChangeData = ultrasonic.simulateFillChange();
  console.log(`  Fill change simulation: +${fillChangeData.fillIncrease}% (${fillChangeData.currentFill}% total)`);
  console.log('');
  
  console.log('✅ All sensors tested successfully!');
}

// Run the test
testSensors();

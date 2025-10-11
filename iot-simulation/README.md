# IoT Edge Layer Simulation

This directory contains a complete simulation of the IoT Edge Layer for the Recycling Badge system. It mimics the behavior of real IoT devices including sensors, edge computing, and MQTT communication.

## 🏗️ Architecture Components

### 1. **Mock Sensors** (`sensors/mockSensors.js`)
- **Load Cell Sensor**: Simulates weight measurements and drop-off events
- **GPS Sensor**: Captures location data with configurable coordinates
- **Ultrasonic Sensor**: Measures fill-level of recycling bins

### 2. **Edge Compute** (`edge-compute/edgeProcessor.js`)
- **Raspberry Pi + Greengrass Simulation**: Processes sensor data
- **Drop-off Detection**: Analyzes weight and fill-level changes
- **Event Creation**: Generates structured drop-off events

### 3. **MQTT Publisher** (`mqtt-publisher/mqttPublisher.js`)
- **AWS IoT Core Simulation**: Publishes events to MQTT broker
- **Event Publishing**: Sends drop-off events to cloud backend
- **Sensor Data Publishing**: Monitors regular sensor readings

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd iot-simulation
npm install
```

### 2. Test Sensors (No MQTT Required)
```bash
npm run test
```

### 3. Test Drop-off Simulation (Local Mode - No MQTT Required)
```bash
npm run simulate-local
```

### 4. Start Continuous Monitoring (Local Mode - No MQTT Required)
```bash
npm run start-local
```

### 5. Set Up MQTT (Optional - For Production Testing)
```bash
# Install local MQTT broker (Mosquitto)
# Then use these commands:
npm run simulate  # With MQTT
npm start         # With MQTT
```

## 📋 Usage Examples

### Basic Drop-off Simulation (Local Mode - No MQTT Required)
```javascript
const IoTSimulationLocal = require('./index-local');

const simulation = new IoTSimulationLocal();
await simulation.initialize();
await simulation.simulateDropOff();
simulation.cleanup();
```

### Continuous Monitoring (Local Mode - No MQTT Required)
```javascript
const simulation = new IoTSimulationLocal();
await simulation.initialize();
simulation.startMonitoring(5000); // Check every 5 seconds

// Stop after some time
setTimeout(() => {
  simulation.stopMonitoring();
  simulation.cleanup();
}, 60000);
```

### With MQTT (Production Mode)
```javascript
const IoTSimulation = require('./index');

const simulation = new IoTSimulation();
await simulation.initialize(); // Connects to MQTT broker
await simulation.simulateDropOff();
simulation.cleanup();
```

### Custom Device Location
```javascript
simulation.setDeviceLocation(40.7589, -73.9851); // Times Square
```

## 🔧 Configuration

### Environment Variables
- `MQTT_BROKER_URL`: MQTT broker endpoint (default: localhost:1883)
- `DEVICE_ID`: Unique device identifier
- `DEVICE_LOCATION_LAT/LNG`: Default GPS coordinates

### Sensor Parameters
- **Weight Threshold**: Minimum weight change to trigger drop-off (0.5kg)
- **Time Threshold**: Minimum time between drop-offs (30 seconds)
- **Fill Level Sensitivity**: Ultrasonic sensor configuration

## 📊 Event Format

### Drop-off Event
```json
{
  "type": "drop_off_event",
  "deviceId": "recycling-bin-001",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "eventId": "drop-off-1705312200000",
  "data": {
    "weight": {
      "current": "3.45",
      "change": "2.10",
      "unit": "kg"
    },
    "location": {
      "latitude": "40.782900",
      "longitude": "-73.965400",
      "accuracy": "3.2"
    },
    "fillLevel": {
      "current": "75.5",
      "change": "12.3",
      "unit": "%"
    },
    "confidence": 0.87,
    "sensors": {
      "loadCell": "load-cell-001",
      "gps": "gps-001",
      "ultrasonic": "ultrasonic-001"
    }
  }
}
```

## 🔗 Integration with Architecture

This simulation integrates with the complete system:

1. **IoT Edge Layer** ✅ (This simulation)
2. **Cloud Backend** → Receives MQTT events
3. **Validation & Mint Lambda** → Processes drop-off events
4. **Blockchain Layer** → Mints NFTs based on events

## 🧪 Testing

### Test Individual Sensors
```bash
node test-sensors.js
```

### Test Drop-off Events
```bash
node simulate-dropoff.js
```

### Test MQTT Publishing
```bash
node index.js
```

## 📝 Notes

- **Local MQTT Broker**: For development, use a local MQTT broker like Mosquitto
- **Production**: Replace with AWS IoT Device SDK for real AWS IoT Core
- **Sensor Accuracy**: Adjust sensor parameters in mock classes for realistic behavior
- **Event Frequency**: Modify monitoring intervals based on your needs

## 🔄 Next Steps

1. **Set up local MQTT broker** (Mosquitto)
2. **Connect to AWS IoT Core** for production
3. **Integrate with Cloud Backend** Lambda functions
4. **Add real sensor hardware** for production deployment

// MQTT Publisher for IoT Edge Simulation
const mqtt = require('mqtt');
require('dotenv').config();

class MQTTPublisher {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.topic = 'recycling/drop-off-events';
    this.qos = 1;
  }

  // Connect to AWS IoT Core
  async connectToAWSIoT() {
    try {
      // For simulation, we'll use a local MQTT broker
      // In production, you'd use AWS IoT Device SDK
      console.log('Connecting to MQTT broker...');
      
      const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
      const options = {
        clientId: `recycling-device-${Date.now()}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      };

      this.client = mqtt.connect(brokerUrl, options);

      this.client.on('connect', () => {
        console.log('✅ Connected to MQTT broker');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
        this.isConnected = false;
      });

      this.client.on('disconnect', () => {
        console.log('❌ Disconnected from MQTT broker');
        this.isConnected = false;
      });

      return new Promise((resolve, reject) => {
        this.client.on('connect', resolve);
        this.client.on('error', reject);
      });

    } catch (error) {
      console.error('Failed to connect to MQTT broker:', error);
      throw error;
    }
  }

  // Publish drop-off event to MQTT
  async publishDropOffEvent(dropOffEvent) {
    if (!this.isConnected) {
      throw new Error('MQTT client not connected');
    }

    try {
      const message = {
        ...dropOffEvent,
        publishedAt: new Date().toISOString(),
        version: '1.0'
      };

      const payload = JSON.stringify(message);

      return new Promise((resolve, reject) => {
        this.client.publish(this.topic, payload, { qos: this.qos }, (error) => {
          if (error) {
            console.error('Failed to publish message:', error);
            reject(error);
          } else {
            console.log('✅ Published drop-off event to MQTT');
            console.log('📊 Event details:', {
              deviceId: dropOffEvent.deviceId,
              weightChange: dropOffEvent.data.weight.change,
              location: `${dropOffEvent.data.location.latitude}, ${dropOffEvent.data.location.longitude}`,
              fillLevelChange: dropOffEvent.data.fillLevel.change
            });
            resolve();
          }
        });
      });

    } catch (error) {
      console.error('Error publishing drop-off event:', error);
      throw error;
    }
  }

  // Publish sensor data (for monitoring)
  async publishSensorData(sensorData) {
    if (!this.isConnected) {
      throw new Error('MQTT client not connected');
    }

    try {
      const message = {
        ...sensorData,
        publishedAt: new Date().toISOString(),
        version: '1.0'
      };

      const payload = JSON.stringify(message);
      const monitoringTopic = 'recycling/sensor-data';

      return new Promise((resolve, reject) => {
        this.client.publish(monitoringTopic, payload, { qos: 0 }, (error) => {
          if (error) {
            console.error('Failed to publish sensor data:', error);
            reject(error);
          } else {
            console.log('📡 Published sensor data to MQTT');
            resolve();
          }
        });
      });

    } catch (error) {
      console.error('Error publishing sensor data:', error);
      throw error;
    }
  }

  // Disconnect from MQTT broker
  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      console.log('🔌 Disconnected from MQTT broker');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      topic: this.topic,
      clientId: this.client ? this.client.options.clientId : null
    };
  }
}

module.exports = MQTTPublisher;

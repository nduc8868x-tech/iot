#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <math.h>

// ================= WIFI =================
const char* ssid = "DO LA 2";
const char* password = "12345679";

// ================= MQTT =================
const char* mqtt_server = "192.168.0.103";
const int mqtt_port = 1883;
const char* mqtt_user = "nmd";
const char* mqtt_password = "123";
const char* client_id = "ESP32_IOT_Device";

WiFiClient espClient;
PubSubClient client(espClient);

// ================= PIN ==================
#define LDR_PIN 34
#define DHT_PIN 33
#define DHT_TYPE DHT11

#define LED1 18  // Temperature
#define LED2 19  // Humidity
#define LED3 21  // Light/Lux

// ================= LDR CONSTANT =================
#define RL10 50
#define GAMMA 0.7

// ================= OBJECT =================
DHT dht(DHT_PIN, DHT_TYPE);

// Device states
bool led1_state = false;
bool led2_state = false;
bool led3_state = false;

unsigned long lastPublish = 0;
const unsigned long publishInterval = 2000; // 2 seconds

// ================= SENSOR =================

float readLux() {
  int rawLight = analogRead(LDR_PIN);

  if (rawLight <= 0) return 0;
  if (rawLight >= 4095) return 10000;

  // Simple linear mapping: 0-4095 ADC to 0-10000 Lux
  // Adjust the 10000 multiplier based on your actual light measurements
  float lux = (rawLight / 4095.0) * 10000.0;
  
  return lux;
}

float readTemperature() {
  float temp = dht.readTemperature();
  return isnan(temp) ? 0 : temp;
}

float readHumidity() {
  float humi = dht.readHumidity();
  return isnan(humi) ? 0 : humi;
}

// ================= LED =================

void ledOn(int ledPin) {
  digitalWrite(ledPin, HIGH);
  Serial.print("LED on pin ");
  Serial.print(ledPin);
  Serial.println(" turned ON");
}

void ledOff(int ledPin) {
  digitalWrite(ledPin, LOW);
  Serial.print("LED on pin ");
  Serial.print(ledPin);
  Serial.println(" turned OFF");
}

void publishDeviceStatus(int deviceId, bool state) {
  String topic = "iot/device/" + String(deviceId) + "/status";
  String payload = "{\"deviceId\":\"" + String(deviceId) + "\",\"status\":" + 
                   (state ? "true" : "false") + ",\"timestamp\":\"" + 
                   String(millis()) + "\"}";
  
  client.publish(topic.c_str(), payload.c_str());
  Serial.print("Published status to ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(payload);
}

// ================= MQTT CALLBACK =================

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("\n📨 Message received on topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.println(message);

  // Device 1 - Temperature LED
  if (String(topic) == "iot/device/1/control") {
    if (message == "ON") {
      ledOn(LED1);
      led1_state = true;
      publishDeviceStatus(1, true);
    } else if (message == "OFF") {
      ledOff(LED1);
      led1_state = false;
      publishDeviceStatus(1, false);
    }
  }
  // Device 2 - Humidity LED
  else if (String(topic) == "iot/device/2/control") {
    if (message == "ON") {
      ledOn(LED2);
      led2_state = true;
      publishDeviceStatus(2, true);
    } else if (message == "OFF") {
      ledOff(LED2);
      led2_state = false;
      publishDeviceStatus(2, false);
    }
  }
  // Device 3 - Light LED
  else if (String(topic) == "iot/device/3/control") {
    if (message == "ON") {
      ledOn(LED3);
      led3_state = true;
      publishDeviceStatus(3, true);
    } else if (message == "OFF") {
      ledOff(LED3);
      led3_state = false;
      publishDeviceStatus(3, false);
    }
  }
}

// ================= WIFI =================

void setup_wifi() {
  Serial.println("\n🌐 Connecting to WiFi...");
  Serial.print("SSID: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi connection failed!");
  }
}

// ================= MQTT =================

void reconnect() {
  int attempts = 0;
  
  while (!client.connected() && attempts < 5) {
    Serial.print("\n📡 Connecting to MQTT broker: ");
    Serial.print(mqtt_server);
    Serial.print(":");
    Serial.println(mqtt_port);

    if (client.connect(client_id, mqtt_user, mqtt_password)) {
      Serial.println("✅ MQTT Connected!");

      // Subscribe to control topics
      client.subscribe("iot/device/1/control");
      client.subscribe("iot/device/2/control");
      client.subscribe("iot/device/3/control");

      Serial.println("📡 Subscribed to control topics:");
      Serial.println("  - iot/device/1/control");
      Serial.println("  - iot/device/2/control");
      Serial.println("  - iot/device/3/control");

    } else {
      Serial.print("❌ MQTT connection failed, rc=");
      Serial.println(client.state());
      Serial.print("Retrying in 2 seconds... (Attempt ");
      Serial.print(attempts + 1);
      Serial.println("/5)");
      delay(2000);
      attempts++;
    }
  }
}

// ================= PUBLISH SENSORS =================

void publishSensorData() {
  float temperature = readTemperature();
  float humidity = readHumidity();
  float lux = readLux();

  // Publish individual sensor topics
  String tempStr = String(temperature, 2);
  String humiStr = String(humidity, 2);
  String luxStr = String(lux, 2);

  // Temperature
  String tempPayload = "{\"value\":" + tempStr + ",\"unit\":\"°C\",\"timestamp\":\"" + 
                       String(millis()) + "\"}";
  client.publish("iot/sensor/temperature/data", tempPayload.c_str());

  // Humidity
  String humiPayload = "{\"value\":" + humiStr + ",\"unit\":\"%\",\"timestamp\":\"" + 
                       String(millis()) + "\"}";
  client.publish("iot/sensor/humidity/data", humiPayload.c_str());

  // Light/Lux
  String luxPayload = "{\"value\":" + luxStr + ",\"unit\":\"Lux\",\"timestamp\":\"" + 
                      String(millis()) + "\"}";
  client.publish("iot/sensor/light/data", luxPayload.c_str());

  // Combined sensor data
  String payload = "{\"temperature\":" + tempStr + ",\"humidity\":" + humiStr + 
                   ",\"light\":" + luxStr + ",\"timestamp\":\"" + String(millis()) + "\"}";
  client.publish("iot/sensor/all", payload.c_str());

  // Serial output
  Serial.println("\n===== SENSOR DATA =====");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  Serial.print("Light (Lux): ");
  Serial.print(lux);
  Serial.println(" lx");
  Serial.println("✅ Sensor data published\n");
}

// ================= SETUP =================

void setup() {
  Serial.begin(115200);
  
  delay(2000);
  Serial.println("\n\n========================================");
  Serial.println("   IoT System - ESP32 Firmware");
  Serial.println("========================================\n");

  // LED setup
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);

  digitalWrite(LED1, LOW);
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, LOW);

  Serial.println("✅ LEDs initialized");
  Serial.println("  - LED1 (pin 18): Temperature");
  Serial.println("  - LED2 (pin 19): Humidity");
  Serial.println("  - LED3 (pin 21): Light\n");

  // LDR setup
  pinMode(LDR_PIN, INPUT);

  // DHT setup
  dht.begin();
  Serial.println("✅ DHT11 sensor initialized\n");

  // WiFi setup
  setup_wifi();

  // MQTT setup
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  Serial.println("\n========================================");
  Serial.println("   Setup Complete - Starting Loop");
  Serial.println("========================================\n");
}

// ================= LOOP =================

void loop() {
  // Reconnect MQTT if disconnected
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  // Publish sensor data every 2 seconds
  if (millis() - lastPublish >= publishInterval) {
    lastPublish = millis();
    
    if (client.connected()) {
      publishSensorData();
    } else {
      Serial.println("⚠️ MQTT not connected, skipping publish");
    }
  }

  delay(100);
}

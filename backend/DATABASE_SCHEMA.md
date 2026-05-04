# IoT System - Database Schema Documentation

**Student**: Nguyễn Văn A (B21DCCN001)  
**Date**: March 2024

---

## Database Overview

This IoT system uses a relational database to store:
1. Device configurations and status
2. Historical sensor readings
3. Device control actions/events
4. System logs

### Supported Databases
- MySQL 5.7+
- PostgreSQL 12+
- SQLite 3 (development only)
- MariaDB 10.3+

---

## Table 1: Devices

Stores information about IoT devices (lights, fans, AC units, etc.)

```sql
CREATE TABLE devices (
  id VARCHAR(50) PRIMARY KEY COMMENT 'Device unique identifier',
  name VARCHAR(255) NOT NULL COMMENT 'Display name',
  type ENUM('light', 'fan', 'ac', 'heater', 'other') NOT NULL COMMENT 'Device type',
  location VARCHAR(255) COMMENT 'Physical location (e.g., "Living Room")',
  status BOOLEAN DEFAULT FALSE COMMENT 'Current ON/OFF state',
  gpio_pin INT COMMENT 'GPIO pin on hardware (for reference)',
  description TEXT COMMENT 'Device description',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
  
  PRIMARY KEY (id),
  INDEX idx_type (type),
  INDEX idx_location (location),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Devices Table - Sample Data
```sql
INSERT INTO devices VALUES
('1', 'Đèn chính', 'light', 'Living Room', true, '16', 'Main ceiling light', NOW(), NOW()),
('2', 'Điều hòa', 'ac', 'Bedroom', false, '17', 'Air conditioning unit', NOW(), NOW()),
('3', 'Quạt trần', 'fan', 'Living Room', true, '18', 'Ceiling fan', NOW(), NOW());
```

### Fields Description
| Field | Type | Description |
|-------|------|-------------|
| id | VARCHAR(50) | Unique device ID (e.g., "1", "device_001") |
| name | VARCHAR(255) | Human-readable name in Vietnamese |
| type | ENUM | Device category |
| location | VARCHAR(255) | Room/area where device is located |
| status | BOOLEAN | Current state (TRUE=ON, FALSE=OFF) |
| gpio_pin | INT | Hardware pin number for reference |
| description | TEXT | Additional notes about device |
| created_at | TIMESTAMP | Auto-set to current time on creation |
| updated_at | TIMESTAMP | Auto-updated on any modification |

---

## Table 2: SensorData

Stores historical readings from all sensors (temperature, humidity, light, etc.)

```sql
CREATE TABLE sensor_data (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique reading ID',
  sensor_type VARCHAR(50) NOT NULL COMMENT 'Type of sensor (temperature, humidity, light)',
  sensor_location VARCHAR(255) COMMENT 'Physical location of sensor',
  value DECIMAL(10, 2) NOT NULL COMMENT 'Measured value',
  unit VARCHAR(20) NOT NULL COMMENT 'Unit of measurement',
  raw_value INT COMMENT 'Raw ADC value from sensor',
  quality TINYINT DEFAULT 100 COMMENT 'Data quality percentage (0-100)',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When measurement was taken',
  notes TEXT COMMENT 'Additional sensor notes',
  
  PRIMARY KEY (id),
  INDEX idx_sensor_type (sensor_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_sensor_location (sensor_location),
  INDEX idx_type_time (sensor_type, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### SensorData Table - Sample Data
```sql
INSERT INTO sensor_data 
  (sensor_type, sensor_location, value, unit, timestamp) 
VALUES
  ('temperature', 'Living Room', 23.5, '°C', '2024-03-22 10:30:00'),
  ('humidity', 'Living Room', 65, '%', '2024-03-22 10:30:00'),
  ('light', 'Living Room', 725, 'Lux', '2024-03-22 10:30:00'),
  ('temperature', 'Bedroom', 21.2, '°C', '2024-03-22 10:30:00'),
  ('humidity', 'Bedroom', 58, '%', '2024-03-22 10:30:00');
```

### Fields Description
| Field | Type | Description |
|-------|------|-------------|
| id | INT | Auto-incrementing primary key |
| sensor_type | VARCHAR(50) | Type: "temperature", "humidity", "light", "pressure", etc. |
| sensor_location | VARCHAR(255) | Room/area where sensor is installed |
| value | DECIMAL(10,2) | Actual measured value |
| unit | VARCHAR(20) | "°C", "%", "Lux", "hPa", etc. |
| raw_value | INT | Original ADC/raw reading (before conversion) |
| quality | TINYINT | Signal quality/confidence (0-100) |
| timestamp | TIMESTAMP | When measurement occurred |
| notes | TEXT | Comments about reading (e.g., "Calibration done") |

### Indexing Strategy
- `idx_timestamp`: For time-range queries (History page)
- `idx_sensor_type`: For filtering by sensor
- `idx_type_time`: Composite index for most common query pattern

### Typical Queries
```sql
-- Get latest readings
SELECT * FROM sensor_data 
WHERE sensor_type = 'temperature' 
ORDER BY timestamp DESC LIMIT 20;

-- Get readings in date range
SELECT * FROM sensor_data 
WHERE timestamp BETWEEN '2024-03-22' AND '2024-03-23'
AND sensor_type = 'temperature'
ORDER BY timestamp DESC;

-- Get average temperature
SELECT AVG(value) as avg_temp, sensor_location
FROM sensor_data
WHERE sensor_type = 'temperature'
AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY sensor_location;
```

---

## Table 3: DeviceActions

Records all device control commands and their results (action history/audit log)

```sql
CREATE TABLE device_actions (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique action ID',
  device_id VARCHAR(50) NOT NULL COMMENT 'Device being controlled',
  action VARCHAR(10) NOT NULL COMMENT 'Action performed (ON, OFF, TOGGLE, etc.)',
  previous_status BOOLEAN COMMENT 'Previous state before action',
  new_status BOOLEAN COMMENT 'New state after action',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'Execution status',
  user_id VARCHAR(50) COMMENT 'Who triggered the action',
  source VARCHAR(50) COMMENT 'Source (web, mobile, automation, manual)',
  response_time INT COMMENT 'Hardware response time in milliseconds',
  error_message VARCHAR(500) COMMENT 'Error details if failed',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When action was initiated',
  executed_at TIMESTAMP COMMENT 'When action was executed on hardware',
  
  PRIMARY KEY (id),
  FOREIGN KEY (device_id) REFERENCES devices(id),
  INDEX idx_device_id (device_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_status (status),
  INDEX idx_device_time (device_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### DeviceActions Table - Sample Data
```sql
INSERT INTO device_actions 
  (device_id, action, previous_status, new_status, status, source, response_time, timestamp) 
VALUES
  ('1', 'ON', false, true, 'success', 'web', 250, NOW()),
  ('2', 'OFF', true, false, 'success', 'web', 180, NOW()),
  ('3', 'ON', false, true, 'success', 'web', 320, NOW()),
  ('1', 'OFF', true, false, 'success', 'web', 200, NOW());
```

### Fields Description
| Field | Type | Description |
|-------|------|-------------|
| id | INT | Auto-incrementing action ID |
| device_id | VARCHAR(50) | FK to devices(id) |
| action | VARCHAR(10) | "ON", "OFF", "TOGGLE", "DIMM", etc. |
| previous_status | BOOLEAN | State before action |
| new_status | BOOLEAN | State after action |
| status | VARCHAR(20) | "success", "failed", "timeout", "pending" |
| user_id | VARCHAR(50) | Who initiated (automation/manual user) |
| source | VARCHAR(50) | Origin: "web", "mobile", "automation", "voice" |
| response_time | INT | Milliseconds for hardware to respond |
| error_message | VARCHAR(500) | Failure reason if status='failed' |
| timestamp | TIMESTAMP | When action was sent |
| executed_at | TIMESTAMP | When hardware confirmed action |

### Indexing Strategy
- `idx_device_id`: For per-device history
- `idx_timestamp`: For time-range queries
- `idx_device_time`: Composite for "device history in timeframe"

### Typical Queries
```sql
-- Get device control history
SELECT * FROM device_actions 
WHERE device_id = '1' 
ORDER BY timestamp DESC LIMIT 20;

-- Get failed actions
SELECT * FROM device_actions 
WHERE status = 'failed'
ORDER BY timestamp DESC;

-- Get today's actions
SELECT device_id, action, new_status, timestamp
FROM device_actions
WHERE DATE(timestamp) = CURDATE()
ORDER BY timestamp DESC;

-- Average response time per device
SELECT device_id, AVG(response_time) as avg_response
FROM device_actions
WHERE response_time > 0
GROUP BY device_id;
```

---

## Table 4: SystemLogs

Logs for debugging, monitoring, and analytics

```sql
CREATE TABLE system_logs (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Log entry ID',
  level VARCHAR(20) NOT NULL COMMENT 'Log level (DEBUG, INFO, WARN, ERROR, CRITICAL)',
  category VARCHAR(50) COMMENT 'Component (api, mqtt, device, sensor, etc.)',
  message TEXT NOT NULL COMMENT 'Log message',
  details JSON COMMENT 'Extended details as JSON',
  source_file VARCHAR(255) COMMENT 'File where log originated',
  line_number INT COMMENT 'Line number in source file',
  user_id VARCHAR(50) COMMENT 'Associated user if applicable',
  ip_address VARCHAR(45) COMMENT 'Client IP address',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When event occurred',
  
  PRIMARY KEY (id),
  INDEX idx_level (level),
  INDEX idx_timestamp (timestamp),
  INDEX idx_category (category),
  INDEX idx_level_time (level, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### SystemLogs Table - Sample Data
```sql
INSERT INTO system_logs 
  (level, category, message, timestamp) 
VALUES
  ('INFO', 'api', 'Device control request received', NOW()),
  ('INFO', 'mqtt', 'Message published to iot/device/1/control', NOW()),
  ('WARN', 'device', 'Device response timeout', NOW()),
  ('ERROR', 'sensor', 'Invalid sensor reading: -999', NOW());
```

---

## Relationships Diagram

```
Devices (1) ─────────────────── (M) DeviceActions
   │                                     │
   │                                     │
   │                            (Control events for each device)
   │
   └──────────── Depends On ─────── SensorData
          
         (Devices use sensor data for decisions)


DeviceActions ─── Records ───► SystemLogs
                 (When action fails, log the error)
```

---

## Data Retention Policy

### Devices Table
- Keep forever (or archive when device retired)
- No automatic cleanup

### SensorData Table
- Keep last 90 days in hot storage
- Archive older data monthly
- Monthly cleanup query:
```sql
DELETE FROM sensor_data 
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

### DeviceActions Table
- Keep last 6 months
- Archive yearly
```sql
DELETE FROM device_actions 
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### SystemLogs Table
- Keep last 30 days
- Archive for compliance
```sql
DELETE FROM system_logs 
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## Backup & Recovery

### Backup Strategy
```bash
# Daily backup
mysqldump -u user -p iot_system > iot_backup_$(date +%Y%m%d).sql

# Or with compression
mysqldump -u user -p iot_system | gzip > iot_backup_$(date +%Y%m%d).sql.gz
```

### Recovery
```bash
# Restore from backup
mysql -u user -p iot_system < iot_backup_20240322.sql

# Or from compressed backup
gunzip < iot_backup_20240322.sql.gz | mysql -u user -p iot_system
```

---

## Performance Optimization

### Current Indexes
```sql
-- All indexes for optimal query performance
CREATE INDEX idx_type ON devices(type);
CREATE INDEX idx_location ON devices(location);
CREATE INDEX idx_status ON devices(status);
CREATE INDEX idx_sensor_type ON sensor_data(sensor_type);
CREATE INDEX idx_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_sensor_location ON sensor_data(sensor_location);
CREATE INDEX idx_type_time ON sensor_data(sensor_type, timestamp);
CREATE INDEX idx_device_id ON device_actions(device_id);
CREATE INDEX idx_timestamp ON device_actions(timestamp);
CREATE INDEX idx_status ON device_actions(status);
CREATE INDEX idx_device_time ON device_actions(device_id, timestamp);
CREATE INDEX idx_level ON system_logs(level);
CREATE INDEX idx_level_time ON system_logs(level, timestamp);
```

### Query Optimization Tips
1. **Always use WHERE clause** with indexed columns
2. **Use LIMIT** when getting multiple records
3. **Avoid SELECT *** use specific columns
4. **Use composite indexes** for multi-column conditions
5. **Run ANALYZE TABLE** periodically

---

## Migration Script

### Create All Tables at Once
```sql
-- Run this to set up complete database

USE iot_system;

CREATE TABLE devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('light', 'fan', 'ac', 'heater', 'other') NOT NULL,
  location VARCHAR(255),
  status BOOLEAN DEFAULT FALSE,
  gpio_pin INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_location (location),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sensor_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sensor_type VARCHAR(50) NOT NULL,
  sensor_location VARCHAR(255),
  value DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  raw_value INT,
  quality TINYINT DEFAULT 100,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_sensor_type (sensor_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_sensor_location (sensor_location),
  INDEX idx_type_time (sensor_type, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE device_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  action VARCHAR(10) NOT NULL,
  previous_status BOOLEAN,
  new_status BOOLEAN,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  user_id VARCHAR(50),
  source VARCHAR(50),
  response_time INT,
  error_message VARCHAR(500),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id),
  INDEX idx_device_id (device_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_status (status),
  INDEX idx_device_time (device_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE system_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level VARCHAR(20) NOT NULL,
  category VARCHAR(50),
  message TEXT NOT NULL,
  details JSON,
  source_file VARCHAR(255),
  line_number INT,
  user_id VARCHAR(50),
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_level (level),
  INDEX idx_timestamp (timestamp),
  INDEX idx_category (category),
  INDEX idx_level_time (level, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data
INSERT INTO devices VALUES
('1', 'Đèn chính', 'light', 'Living Room', true, '16', 'Main ceiling light', NOW(), NOW()),
('2', 'Điều hòa', 'ac', 'Bedroom', false, '17', 'Air conditioning', NOW(), NOW()),
('3', 'Quạt trần', 'fan', 'Living Room', true, '18', 'Ceiling fan', NOW(), NOW());

COMMIT;
```

---

## Monitoring Queries

### Database Statistics
```sql
-- Table sizes
SELECT 
  TABLE_NAME,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'iot_system';

-- Count records per table
SELECT 
  'devices' as table_name, COUNT(*) as row_count FROM devices
UNION ALL
SELECT 'sensor_data', COUNT(*) FROM sensor_data
UNION ALL
SELECT 'device_actions', COUNT(*) FROM device_actions
UNION ALL
SELECT 'system_logs', COUNT(*) FROM system_logs;
```

---

**Version**: 1.0  
**Last Updated**: March 2024  
**Status**: Production Ready

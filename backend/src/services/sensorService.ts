import { format } from 'date-fns';
import { SensorData } from '../models/SensorData.js';
import { SensorHistoryRecord, PaginatedResponse } from '../types/index.js';

export async function saveSensorReading(
  temperature: number,
  humidity: number,
  light: number
): Promise<void> {
  await SensorData.create({ temperature, humidity, light });
}

export async function getSensorHistory(
  page: number,
  limit: number
): Promise<PaginatedResponse<SensorHistoryRecord>> {
  const skip  = (page - 1) * limit;
  const total = await SensorData.countDocuments();
  const docs  = await SensorData.find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const records: SensorHistoryRecord[] = docs.map((doc, i) => ({
    id:          skip + i + 1,
    deviceId:    `#${String(doc._id).slice(-4).toUpperCase()}`,
    temperature: doc.temperature,
    humidity:    doc.humidity,
    light:       doc.light,
    timestamp:   format(new Date(doc.timestamp), 'HH:mm:ss dd/MM/yyyy'),
  }));

  return { records, total, page, limit, totalPages: Math.ceil(total / limit) };
}

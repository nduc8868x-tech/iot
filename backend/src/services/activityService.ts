import { format } from 'date-fns';
import { DeviceAction } from '../models/DeviceAction.js';
import { ActivityRecord, DailyStats, PaginatedResponse, StatRecord } from '../types/index.js';

const DEVICE_NAMES: Record<string, string> = {
  '1': 'Đèn chính',
  '2': 'Điều hòa',
  '3': 'Quạt trần',
  '4': 'Đèn phụ',
  '5': 'Quạt bàn',
};

export async function getActivity(
  page: number,
  limit: number
): Promise<PaginatedResponse<ActivityRecord>> {
  const skip  = (page - 1) * limit;
  const total = await DeviceAction.countDocuments();
  const docs  = await DeviceAction.find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const records: ActivityRecord[] = docs.map((doc, i) => ({
    id:        skip + i + 1,
    device:    doc.device,
    deviceId:  doc.deviceId,
    action:    doc.action,
    status:    doc.status,
    timestamp: format(new Date(doc.timestamp), 'HH:mm:ss dd/MM/yyyy'),
  }));

  return { records, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

export async function recordActivity(
  deviceId: string,
  action: 'ON' | 'OFF',
  success: boolean
): Promise<void> {
  await DeviceAction.create({
    device:   DEVICE_NAMES[deviceId] ?? `Thiết bị ${deviceId}`,
    deviceId: `#${deviceId}`,
    action:   action === 'ON' ? 'BẬT' : 'TẮT',
    status:   success ? 'Thành công' : 'Thất bại',
  });
}

export async function getActivityStats(): Promise<StatRecord> {
  const deviceNames = Object.values(DEVICE_NAMES);
  const docs = await DeviceAction.find().sort({ timestamp: 1 }).lean();

  const dateMap: Map<string, Record<string, number>> = new Map();
  for (const doc of docs) {
    const date = format(new Date(doc.timestamp), 'dd/MM/yyyy');
    if (!dateMap.has(date)) dateMap.set(date, {});
    const dayEntry = dateMap.get(date)!;
    dayEntry[doc.device] = (dayEntry[doc.device] ?? 0) + 1;
  }

  const dates: DailyStats[] = Array.from(dateMap.entries()).map(([date, counts]) => {
    const row: DailyStats = { date };
    for (const name of deviceNames) row[name] = counts[name] ?? 0;
    return row;
  });

  return { dates, devices: deviceNames };
}

import { Schema, model, Document } from 'mongoose';

export interface IDeviceAction extends Document {
  device:    string;
  deviceId:  string;
  action:    'BẬT' | 'TẮT';
  status:    'Thành công' | 'Thất bại';
  timestamp: Date;
}

const DeviceActionSchema = new Schema<IDeviceAction>({
  device:    { type: String, required: true },
  deviceId:  { type: String, required: true, index: true },
  action:    { type: String, enum: ['BẬT', 'TẮT'], required: true },
  status:    { type: String, enum: ['Thành công', 'Thất bại'], required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

export const DeviceAction = model<IDeviceAction>('DeviceAction', DeviceActionSchema);

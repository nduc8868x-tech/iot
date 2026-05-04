import { Schema, model, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId:    string;
  name:        string;
  type:        'light' | 'fan' | 'ac' | 'other';
  status:      boolean;
  lastUpdated: Date;
}

const DeviceSchema = new Schema<IDevice>({
  deviceId:    { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  type:        { type: String, enum: ['light', 'fan', 'ac', 'other'], required: true },
  status:      { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

export const Device = model<IDevice>('Device', DeviceSchema);

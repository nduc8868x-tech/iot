import { Schema, model, Document } from 'mongoose';

export interface ISensorData extends Document {
  temperature: number;
  humidity: number;
  light: number;
  timestamp: Date;
}

const SensorDataSchema = new Schema<ISensorData>({
  temperature: { type: Number, required: true },
  humidity:    { type: Number, required: true },
  light:       { type: Number, required: true },
  timestamp:   { type: Date,   default: Date.now, index: true },
});

export const SensorData = model<ISensorData>('SensorData', SensorDataSchema);

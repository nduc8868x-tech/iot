import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }
}

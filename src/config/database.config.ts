import mongoose from 'mongoose';
import { config } from './index';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

export default connectDB;

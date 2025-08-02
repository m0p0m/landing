import mongoose from 'mongoose';
import { env } from '../../config/env.config';

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongo.uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

export default connectDB;

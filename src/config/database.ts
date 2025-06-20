import mongoose from 'mongoose';
import config from './environment';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error}`);
  }
};

export { connectDB }; 
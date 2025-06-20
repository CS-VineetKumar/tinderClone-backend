import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error}`);
  }
};

export { connectDB }; 
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      "mongodb+srv://devtovineetkumar:lplnHS8MLgMTvFLk@vineet-node.fhu069h.mongodb.net/tinderClone"
    );
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error}`);
  }
};

export { connectDB }; 
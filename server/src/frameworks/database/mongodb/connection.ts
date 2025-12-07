import mongoose from "mongoose";
import configKeys from "../../../config";
mongoose.set("strictQuery", true);

// Export a function to check if MongoDB is connected
export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

const connectDB = async (): Promise<void> => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(configKeys.DB_CLUSTER_URL, {
      dbName: configKeys.DB_NAME,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
      retryWrites: true,
      w: 'majority'
    });
    console.log(`Database connected successfully`.bg_green);
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    // Throw error so caller can handle retry
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default connectDB;

import mongoose, { ConnectionStates } from "mongoose";
import configKeys from "../../../config";
mongoose.set("strictQuery", true);

// Export a function to check if MongoDB is connected
export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === ConnectionStates.connected;
};

const connectDB = async (): Promise<void> => {
  // Check if already connected
  if (mongoose.connection.readyState === ConnectionStates.connected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(configKeys.DB_CLUSTER_URL, {
      dbName: configKeys.DB_NAME,
    });
    console.log(`Database connected successfully`.bg_green);
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    // Don't throw - let mongoose buffer operations
    // Connection will retry automatically
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

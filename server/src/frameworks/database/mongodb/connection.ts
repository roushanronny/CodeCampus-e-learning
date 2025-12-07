import mongoose from "mongoose";
import configKeys from "../../../config";
mongoose.set("strictQuery", true);

// Export a function to check if MongoDB is connected
// readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
export const isMongoConnected = (): boolean => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const connectDB = async (): Promise<void> => {
  // Check if already connected (readyState 1 = connected)
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  // Check if connection string is set
  if (!configKeys.DB_CLUSTER_URL || configKeys.DB_CLUSTER_URL === 'mongodb://127.0.0.1:27017') {
    console.warn('⚠️  MongoDB connection string not configured. Using default localhost.');
    console.warn('Please set DB_CLUSTER_URL in .env file for production.');
  }

  try {
    console.log(`Connecting to MongoDB...`);
    console.log(`Database: ${configKeys.DB_NAME}`);
    await mongoose.connect(configKeys.DB_CLUSTER_URL, {
      dbName: configKeys.DB_NAME,
    });
    console.log(`✅ Database connected successfully`.bg_green);
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
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

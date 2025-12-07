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

  // Check if connection string is available
  if (!configKeys.DB_CLUSTER_URL || configKeys.DB_CLUSTER_URL.includes('mongodb://127.0.0.1')) {
    console.error('⚠️  MongoDB connection string not configured or using localhost');
    console.error('Please set DB_CLUSTER_URL environment variable in Railway');
    throw new Error('MongoDB connection string not configured');
  }

  try {
    console.log(`Attempting to connect to MongoDB...`);
    console.log(`Database: ${configKeys.DB_NAME}`);
    console.log(`Connection URL: ${configKeys.DB_CLUSTER_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials
    
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
    
    // If mongoose.connect() didn't throw, connection is established
    console.log(`✅ Database connected successfully`.bg_green);
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error details:', error);
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

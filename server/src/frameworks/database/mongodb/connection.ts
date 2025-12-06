import mongoose from "mongoose";
import configKeys from "../../../config";
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(configKeys.DB_CLUSTER_URL, {
      dbName: configKeys.DB_NAME,
    });
    console.log(`Database connected successfully`.bg_green);
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit immediately - retry connection
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};
export default connectDB;

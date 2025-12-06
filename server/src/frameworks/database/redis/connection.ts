import configKeys from '../../../config';
import { createClient } from 'redis'

const connection = () => {
  const createRedisClient = (): any => {
    // If REDIS_URL is not set or is localhost default, skip Redis in production
    if (!configKeys.REDIS_URL || 
        configKeys.REDIS_URL === 'redis://127.0.0.1:6379' ||
        configKeys.REDIS_URL === 'redis://localhost:6379') {
      if (configKeys.NODE_ENV === 'production') {
        console.log('⚠️  Redis not configured - running without cache');
        return null;
      }
    }

    try {
      const client = createClient({
        url: configKeys.REDIS_URL,
      });
      
      client.on('error', err => {
        console.log('Redis Client Error', err);
        // Don't crash the app on Redis errors
      });
      
      client.connect().then(() => {
        console.log("Redis connected successfully".bg_red.bold);
      }).catch((err) => {
        console.log('⚠️  Redis connection failed - continuing without cache:', err.message);
        // Return null if connection fails
      });
      
      return client;
    } catch (error: any) {
      console.log('⚠️  Redis initialization failed - continuing without cache:', error.message);
      return null;
    }
  };

  return {
    createRedisClient
  };
}

export default connection
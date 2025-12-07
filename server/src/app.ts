import express, { Application, NextFunction } from 'express';
import connectToMongoDb from './frameworks/database/mongodb/connection';
import http from 'http';
import serverConfig from './frameworks/webserver/server';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes';
import connection from './frameworks/database/redis/connection';
import colors from 'colors.ts';
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandling';
import configKeys from './config'; 
import AppError from './utils/appError';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types/socketInterfaces';
import { Server } from 'socket.io';
import socketConfig from './frameworks/websocket/socket';
import { authService } from './frameworks/services/authService';

colors?.enable();

const app: Application = express();
const server = http.createServer(app);

//* web socket connection
const io = new Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>(server,{
  cors:{
      origin:configKeys.ORIGIN_PORT,
      methods:["GET","POST"]
  } 
});

socketConfig(io,authService())  

//* connection to redis (optional - app will work without it)
const redisClient = connection().createRedisClient();

//* express config connection
expressConfig(app);

//* routes for each endpoint
routes(app, redisClient);

//* handles server side errors
app.use(errorHandlingMiddleware);

//* catch 404 and forward to error handler
app.all('*', (req, res, next: NextFunction) => {
  next(new AppError('Not found', 404));
});

//* Start server immediately - MongoDB will connect in background
serverConfig(server).startServer();

//* Connect to MongoDB in background (non-blocking)
const connectMongoDB = async () => {
  let retryCount = 0;
  const maxRetries = 20; // Try for about 100 seconds (20 * 5s)
  
  const attemptConnection = async () => {
    try {
      console.log(`[MongoDB] Connection attempt ${retryCount + 1}/${maxRetries}...`);
      await connectToMongoDb();
      console.log('✅ MongoDB connection established successfully');
      retryCount = 0; // Reset on success
    } catch (error: any) {
      retryCount++;
      console.error(`❌ Failed to connect to MongoDB (attempt ${retryCount}/${maxRetries}):`, error.message);
      
      if (retryCount >= maxRetries) {
        console.error('⚠️  Maximum retry attempts reached. MongoDB connection failed.');
        console.error('Please check:');
        console.error('1. DB_CLUSTER_URL is set in Railway environment variables');
        console.error('2. MongoDB Atlas network access allows Railway IPs (0.0.0.0/0)');
        console.error('3. Database user credentials are correct');
        // Continue retrying but with longer intervals
        setTimeout(attemptConnection, 30000); // Retry every 30 seconds after max retries
      } else {
        console.log(`Retrying MongoDB connection in 5 seconds...`);
        setTimeout(attemptConnection, 5000);
      }
    }
  };
  
  // Start connection attempt
  attemptConnection();
};

// Start MongoDB connection in background
connectMongoDB();

// Handle uncaught exceptions and unhandled rejections to prevent crashes
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit - log and continue
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - log and continue
});

export type RedisClient = typeof redisClient | null;

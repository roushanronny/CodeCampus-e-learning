import { Application, Request, Response, NextFunction } from 'express';
import authRouter from './auth';
import adminRouter from './admin';
import courseRouter from './course';
import instructorRouter from './instructor';
import { RedisClient } from '../../../app';
import jwtAuthMiddleware from '../middlewares/userAuth';
import roleCheckMiddleware from '../middlewares/roleCheckMiddleware';
import videoStreamRouter from './videoStream';
import refreshRouter from './refresh';
import paymentRouter from './payment';
import categoryRouter from './category';
import studentRouter from './student';
import { isMongoConnected } from '../../database/mongodb/connection';
import AppError from '../../../utils/appError';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';

const routes = (app: Application, redisClient: RedisClient) => {
  // MongoDB connection check middleware (skip for health check)
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip MongoDB check for health endpoint
    if (req.path === '/health') {
      return next();
    }
    
    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      return res.status(HttpStatusCodes.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: 'Database connection is not available. Please try again in a moment.'
      });
    }
    next();
  });

  // Health check endpoint for Railway/verification
  app.get('/health', (req, res) => {
    const mongoStatus = isMongoConnected() ? 'connected' : 'disconnected';
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      database: mongoStatus,
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRouter());
  app.use('/api/all/refresh-token', refreshRouter());
  app.use(
    '/api/admin',
    jwtAuthMiddleware,
    roleCheckMiddleware('admin'),
    adminRouter()
  );
  app.use('/api/category', categoryRouter());
  app.use('/api/courses', courseRouter(redisClient));
  app.use('/api/video-streaming', videoStreamRouter());
  app.use('/api/instructors', instructorRouter());
  app.use('/api/payments', jwtAuthMiddleware, paymentRouter());
  app.use('/api/students', studentRouter(redisClient));
};

export default routes;

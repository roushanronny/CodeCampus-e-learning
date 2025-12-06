import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import configKeys from '../../config';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // maximum requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  keyGenerator: (req) => {
    const xRealIp = req.headers['x-real-ip'];
    return xRealIp ? String(xRealIp) : (req.ip || 'unknown');
  }
});

const expressConfig = (app: Application) => {
  // Development logging
  if (configKeys.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  app.set('trust proxy', true); // Enable trust for X-Forwarded-* headers
  // CORS configuration - allows frontend from Vercel or localhost
  const allowedOrigins = [
    configKeys.ORIGIN_PORT || 'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  // Custom middleware to handle missing upload files gracefully
  const uploadsDir = path.join(process.cwd(), 'uploads');
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Serve uploaded files locally (for development when AWS is not configured)
  // Use static middleware with custom error handling
  const staticMiddleware = express.static(uploadsDir, {
    // Don't throw errors, just pass to next middleware
    fallthrough: true
  });
  
  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    // Remove leading slash from req.path for path.join
    const relativePath = req.path.startsWith('/') ? req.path.slice(1) : req.path;
    const filePath = path.join(uploadsDir, relativePath);
    
    // Check if file exists and is actually a file (not a directory)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      // File exists, use static middleware
      staticMiddleware(req, res, next);
    } else {
      // File doesn't exist, return 404 without throwing error
      // This prevents the request from reaching the catch-all route
      res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
      // Don't call next() to prevent reaching catch-all route
    }
  });
  
  app.use(limiter);
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        imgSrc: ["'self'", 'data:'],
        frameSrc: ["'self'", 'https:']
      }
    })
  );
  app.use(mongoSanitize());
};

export default expressConfig;

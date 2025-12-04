import { NextFunction, Response } from 'express';
import HttpStatusCodes from '../../../constants/HttpStatusCodes';
import AppError from '../../../utils/appError';
import { authService } from '../../services/authService';
import { CustomRequest } from '@src/types/customRequest';
import { JwtPayload } from '@src/types/common';

const jwtAuthMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new AppError('Token not found', HttpStatusCodes.UNAUTHORIZED);
  }
  try {
    // jwt.verify returns the decoded token which has the payload
    // Token was signed as: jwt.sign({ payload }, secret) 
    // So decoded result is: { payload: { Id, email, role }, iat, exp }
    const decoded = authService().verifyToken(token) as any;
    console.log('Token decoded:', decoded);
    
    if (decoded && decoded.payload) {
      req.user = decoded.payload;
      next();
    } else if (decoded && decoded.Id) {
      // Handle case where payload is directly in decoded (if token structure is different)
      req.user = decoded;
      next();
    } else {
      console.error('Invalid token structure:', decoded);
      throw new AppError('Invalid token format', HttpStatusCodes.UNAUTHORIZED);
    }
  } catch (err: any) {
    console.error('JWT verification error:', err.name, err.message);
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Session is expired please login again', HttpStatusCodes.UNAUTHORIZED);
    } else if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', HttpStatusCodes.UNAUTHORIZED);
    } else if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError(err.message || 'Authentication failed', HttpStatusCodes.UNAUTHORIZED);
    }
  }
};

export default jwtAuthMiddleware;

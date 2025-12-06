import { NextFunction, Response } from 'express';
import { CustomRequest } from '@src/types/customRequest';
import { RedisClient } from '../../../app';

export function cachingMiddleware(redisClient: RedisClient | null, key?: string) {
  return async function (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    // Skip caching if Redis is not available
    if (!redisClient) {
      return next();
    }

    const { search, filter } = req.query as { search: string; filter: string };
    const searchKey = search ?? filter ?? key ?? req.user?.Id;

    if (!searchKey) {
      // If both search, filter, and key are not present in query and params
      return next();
    }

    try {
      const data = await redisClient.get(searchKey);
      if (!data) {
        return next();
      } else {
        res.json({ data: JSON.parse(data) });
      }
    } catch (error) {
      // If Redis operation fails, continue without cache
      console.log('Redis cache read failed, continuing without cache');
      return next();
    }
  };
}

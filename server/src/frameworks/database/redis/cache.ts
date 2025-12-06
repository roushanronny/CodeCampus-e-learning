import { RedisClient } from "../../../app";

export function redisRepository(redisClient: RedisClient) {
  const setCache = async({
    key,
    expireTimeSec,
    data,
  }: {
    key: string;
    expireTimeSec: number;
    data: string;
  }) => {
    if (!redisClient) return;
    try {
      await redisClient.setEx(key, expireTimeSec, data);
    } catch (error) {
      console.log('Redis cache set failed, continuing without cache');
    }
  };
  return {
    setCache,
  };
}

export type RedisRepository = typeof redisRepository;


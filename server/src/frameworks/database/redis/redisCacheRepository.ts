import { CourseInterface } from '@src/types/courseInterface';
import { RedisClient } from '../../../app';

export function redisCacheRepository(redisClient: RedisClient | null) {

  const setCache = async ({
    key,
    expireTimeSec,
    data
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

  const clearCache = async (key: string) => {
    if (!redisClient) return false;
    try {
      const result = await redisClient.del(key);
      return result === 1;
    } catch (error) {
      console.log('Redis cache clear failed, continuing without cache');
      return false;
    }
  };

  const populateTrie = async (course: CourseInterface) => {
    if (!redisClient) return;
    try {
      const trie: { [key: string]: any } = {}; // Initialize the trie object

      const title = course.title.toLowerCase();
      let currentNode: { [key: string]: any } = trie;

      for (const char of title) {
        if (!currentNode[char]) {
          currentNode[char] = {}; // Create a child node for the character
        }
        currentNode = currentNode[char]; // Move to the next node
      }

      currentNode['*'] = course.title; // Mark the end of the course title with '*'
      await redisClient.set('course-trie', JSON.stringify(trie)); // Store the trie in Redis
    } catch (error) {
      console.log('Redis trie population failed, continuing without cache');
    }
  };

  return {
    setCache,
    clearCache,
    populateTrie
  };
}

export type RedisRepositoryImpl = typeof redisCacheRepository;

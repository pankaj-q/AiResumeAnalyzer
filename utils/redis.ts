import { Redis as RedisClient } from 'ioredis';
import logger from './logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: RedisClient | null = null;

try {
  redis = new RedisClient(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redis.on('error', (err: Error) => {
    logger.warn('Redis connection error (caching disabled):', err.message);
    redis = null;
  });

  redis.on('ready', () => logger.info('Redis connected'));
} catch {
  logger.warn('Redis unavailable — running without cache');
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const val = await redis.get(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, data: unknown, ttl = 3600): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch { /* silently ignore */ }
}

export function getRedisClient(): RedisClient | null {
  return redis;
}

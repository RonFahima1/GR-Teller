import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export default redisClient;

export async function rateLimit(identifier: string, limit: number, window: number) {
  const key = `rate-limit:${identifier}`;
  const current = await redisClient.incr(key);
  
  if (current === 1) {
    await redisClient.expire(key, window);
  }
  
  return current <= limit;
} 
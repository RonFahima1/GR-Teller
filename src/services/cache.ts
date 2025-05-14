import Redis from 'redis';
import { promisify } from 'util';
import { env } from '@/lib/env';

export class CacheService {
  private client: Redis.RedisClient;
  private getAsync: (key: string) => Promise<string | null>;
  private setAsync: (key: string, value: string, ttl: number) => Promise<'OK'>;
  private delAsync: (key: string) => Promise<number>;

  constructor() {
    this.client = Redis.createClient({
      url: env.REDIS_URL,
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    this.client.on('error', (error) => {
      console.error('Redis Error:', error);
    });
  }

  async get(key: string): Promise<string | null> {
    return this.getAsync(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.setAsync(key, value, 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.delAsync(key);
  }

  async close(): Promise<void> {
    await this.client.quit();
  }

  // Helper methods for common cache operations
  async cacheData(key: string, data: any, ttl: number = 3600): Promise<void> {
    const stringData = JSON.stringify(data);
    await this.set(key, stringData, ttl);
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Cache key builders
  static buildKey(prefix: string, ...args: string[]): string {
    return `${prefix}:${args.join(':')}`;
  }
}

// Singleton instance
export const cacheService = new CacheService();

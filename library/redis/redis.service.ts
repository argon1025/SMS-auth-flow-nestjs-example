import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  get<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  set<T>(key: string, value: T, options?: CachingConfig) {
    return this.cacheManager.set(key, value, options);
  }

  delete(key: string) {
    return this.cacheManager.del(key);
  }
}

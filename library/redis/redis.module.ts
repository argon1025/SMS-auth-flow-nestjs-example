import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigService } from '@nestjs/config';

import { RedisService } from 'library/redis/redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

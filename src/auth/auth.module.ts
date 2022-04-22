import { Module } from '@nestjs/common';

import { PrismaModule } from 'library/prisma/prisma.module';
import { RedisModule } from 'library/redis/redis.module';
import { SmsModule } from 'library/sms/sms.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, RedisModule, SmsModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}

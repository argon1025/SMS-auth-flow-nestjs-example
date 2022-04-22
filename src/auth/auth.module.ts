import { Module } from '@nestjs/common';
import { CookieModule } from 'library/cookie/cookie.module';
import { TokenModule } from 'library/jwt/token.module';

import { PrismaModule } from 'library/prisma/prisma.module';
import { RedisModule } from 'library/redis/redis.module';
import { SmsModule } from 'library/sms/sms.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, RedisModule, SmsModule, CookieModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}

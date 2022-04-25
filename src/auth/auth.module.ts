import { Module } from '@nestjs/common';
import { CookieModule } from 'library/cookie/cookie.module';

import { TokenModule } from 'library/jwt/token.module';
import { PrismaModule } from 'library/prisma/prisma.module';
import { RedisModule } from 'library/redis/redis.module';
import { SmsModule } from 'library/sms/sms.module';
import { JwtAuthStrategy } from 'src/auth/strategy/jwt-auth.strategy';
import { CryptoModule } from 'library/crypto/crypto.module';
import { JwtRefreshStrategy } from 'src/auth/strategy/jwt-refresh.strategy';
import { JwtAccessStrategy } from 'src/auth/strategy/jwt-access.strategy';
import { AuthRepository } from './auth.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    SmsModule,
    CookieModule,
    TokenModule,
    CryptoModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
  ],
})
export class AuthModule {}

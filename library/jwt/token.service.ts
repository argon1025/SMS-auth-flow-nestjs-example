import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthTokenPayLoad } from 'library/jwt/type/auth-token-payload';
import { RefreshTokenPayLoad } from 'library/jwt/type/refresh-token-payload';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // NOTE: 회원  가입, 수정에만 사용가능한 토큰
  generateAuthToken(payload: AuthTokenPayLoad) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: RefreshTokenPayLoad) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }
}

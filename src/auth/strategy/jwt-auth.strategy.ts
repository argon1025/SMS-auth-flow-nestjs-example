import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthTokenPayLoad } from 'library/jwt/type/auth-token-payload';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'auth-token') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.authToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_AUTH_SECRET_KEY'),
    });
  }

  async validate(payload: AuthTokenPayLoad) {
    return payload;
  }
}

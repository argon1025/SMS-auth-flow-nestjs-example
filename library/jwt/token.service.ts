import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthTokenPayLoad } from 'library/jwt/type/auth-token-payload';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // NOTE: 회원  가입, 수정에만 사용가능한 토큰
  generateAuthToken(payload: AuthTokenPayLoad) {
    return this.jwtService.sign(payload);
  }
}

import {
  applyDecorators,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { TokenUnauthorizedError } from 'library/jwt/type/jwt.error.type';

@Injectable()
class JwtAccessToken extends AuthGuard('access-token') {
  // NOTE: 에러를 핸들링 한다, 유저가 존재하지 않을 경우 null 데이터를 그대로 리턴한다
  handleRequest<TUser>(err: Error, user: TUser) {
    if (err) throw new ForbiddenException(TokenUnauthorizedError);
    return user;
  }
}
export const JwtAccessTokenGuard = () =>
  applyDecorators(UseGuards(JwtAccessToken), ApiBearerAuth('accessToken'));

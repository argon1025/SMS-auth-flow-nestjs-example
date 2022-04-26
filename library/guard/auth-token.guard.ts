import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  NoHaveAuthTokenError,
  TokenUnauthorizedError,
} from 'library/jwt/type/jwt.error.type';

@Injectable()
class JwtAuthToken extends AuthGuard('auth-token') {
  // NOTE: 에러를 핸들링 한다
  handleRequest<TUser>(err: Error, user: TUser) {
    if (err) throw new ForbiddenException(TokenUnauthorizedError);
    if (!user) throw new UnauthorizedException(NoHaveAuthTokenError);
    return user;
  }
}
export const JwtAuthTokenGuard = () => UseGuards(JwtAuthToken);

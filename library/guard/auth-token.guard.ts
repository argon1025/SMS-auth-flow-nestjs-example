import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtAuthToken extends AuthGuard('auth-token') {
  // NOTE: 에러를 핸들링 한다
  handleRequest<TUser>(err: Error, user: TUser) {
    if (err) throw new ForbiddenException();
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
export const JwtAuthTokenGuard = () => UseGuards(JwtAuthToken);

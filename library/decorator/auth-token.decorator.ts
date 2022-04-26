import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthTokenPayLoad } from 'library/jwt/type/auth-token-payload.type';

export const JwtAuthTokenData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthTokenPayLoad => {
    const request = ctx.switchToHttp().getRequest();
    // TODO: 타입 단언 변경 필요
    const tokenPayload = request.user as AuthTokenPayLoad;

    return { phone: tokenPayload.phone };
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RefreshTokenPayLoad } from 'library/jwt/type/refresh-token-payload.type';

export const JwtRefreshTokenData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): RefreshTokenPayLoad => {
    const request = ctx.switchToHttp().getRequest();
    // TODO: 타입 단언 변경 필요
    const tokenPayload = request.user as RefreshTokenPayLoad;

    return { id: tokenPayload.id };
  },
);

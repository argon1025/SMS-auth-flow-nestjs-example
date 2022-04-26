import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AccessTokenPayLoad } from 'library/jwt/type/access-token-payload.type';

export const JwtAccessTokenData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AccessTokenPayLoad => {
    const request = ctx.switchToHttp().getRequest();
    // TODO: 타입 단언 변경 필요
    const tokenPayload = request.user as AccessTokenPayLoad;

    return { id: tokenPayload.id ?? null };
  },
);

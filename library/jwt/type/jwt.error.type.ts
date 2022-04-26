import { ExceptionMessageInterface } from 'library/exception/type/custom-exception-message.type';

export const UnauthorizedError: ExceptionMessageInterface = {
  KR: '권한이 부족합니다. 로그인해 주세요',
} as const;

export const TokenUnauthorizedError: ExceptionMessageInterface = {
  KR: '토큰 정보가 올바르지않습니다 다시 로그인 해 주세요',
} as const;

export const NoHaveAuthTokenError: ExceptionMessageInterface = {
  KR: '휴대폰 인증이 필요합니다',
} as const;

export const NoHaveRefreshTokenError: ExceptionMessageInterface = {
  KR: '로그인이 필요합니다',
} as const;

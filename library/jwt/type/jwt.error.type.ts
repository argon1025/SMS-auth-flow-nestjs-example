import { ExceptionMessageInterface } from 'library/exception/type/custom-exception-message.type';

export const UnauthorizedError: ExceptionMessageInterface = {
  KR: '권한이 부족합니다. 로그인해 주세요',
} as const;

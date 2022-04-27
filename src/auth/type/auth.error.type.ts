import { ExceptionMessageInterface } from 'library/exception/type/custom-exception-message.type';

export const NotFoundVerificationError: ExceptionMessageInterface = {
  KR: '인증번호가 만료되었거나 인증번호를 요청하신 내역이 없습니다',
} as const;

export const MismatchVerificationError: ExceptionMessageInterface = {
  KR: '인증번호가 올바르지 않습니다 다시 시도해 주세요',
} as const;

export const NotFoundCustomerError: ExceptionMessageInterface = {
  KR: '고객님을 찾을 수 없습니다, 가입해 주세요',
} as const;

export const MismatchVerificationPasswordError: ExceptionMessageInterface = {
  KR: '비밀번호가 올바르지 않습니다 다시 시도해 주세요',
} as const;

export const NeedCreateFirstError: ExceptionMessageInterface = {
  KR: '휴대폰 인증 후에 가입할 수 있습니다',
} as const;

export const NeedJoinError: ExceptionMessageInterface = {
  KR: '회원가입이 필요합니다',
} as const;

export const AlreadyJoinedError: ExceptionMessageInterface = {
  KR: '이미 가입한 유저입니다',
} as const;

export const AlreadyUsedUniqueValueError: ExceptionMessageInterface = {
  KR: '이메일 또는 별명이 이미 사용중입니다.',
} as const;

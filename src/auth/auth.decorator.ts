import { applyDecorators, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export const SendSms = () =>
  applyDecorators(
    Post('sms'),
    ApiOkResponse({ description: 'sms 전송요청 성공', type: '' }),
  );

export const VerificationSms = () =>
  applyDecorators(
    Post('sms/verification'),
    ApiOkResponse({ description: '코드 인증 및 쿠키 발급 성공', type: '' }),
  );

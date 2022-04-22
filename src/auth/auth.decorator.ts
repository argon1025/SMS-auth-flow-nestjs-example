import { applyDecorators, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export const SendSms = () =>
  applyDecorators(
    Post('sms'),
    ApiOkResponse({ description: 'sms 전송요청 성공', type: '' }),
  );

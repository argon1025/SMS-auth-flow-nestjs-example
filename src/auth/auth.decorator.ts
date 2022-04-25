import { applyDecorators, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthTokenGuard } from 'library/guard/auth-token.guard';
import { JwtRefreshTokenGuard } from 'library/guard/refresh-token.guard';

import { GetAccessTokenResponseDto } from 'src/auth/dto/get-access-token.dto';

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

export const JoinCustomer = () =>
  applyDecorators(
    Put(),
    JwtAuthTokenGuard(),
    ApiOkResponse({ description: '가입 성공', type: '' }),
  );

export const ChangePassword = () =>
  applyDecorators(
    Patch('password'),
    JwtAuthTokenGuard(),
    ApiOkResponse({ description: '비밀번호 변경 성공', type: '' }),
  );

export const Login = () =>
  applyDecorators(
    Post('login'),
    ApiOkResponse({ description: '로그인 성공', type: '' }),
  );

export const GetAccessToken = () =>
  applyDecorators(
    Get('access-token'),
    JwtRefreshTokenGuard(),
    ApiOkResponse({
      description: '액세스 토큰 발급 성공',
      type: GetAccessTokenResponseDto,
    }),
  );

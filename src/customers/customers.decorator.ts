import { applyDecorators, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'library/guard/access-token.guard';
import { GetMeResponseDto } from 'src/customers/dto/get-me.dto';

export const GetMe = () =>
  applyDecorators(
    Get('me'),
    JwtAccessTokenGuard(),
    ApiOkResponse({ description: '내정보 로드 성공', type: GetMeResponseDto }),
  );

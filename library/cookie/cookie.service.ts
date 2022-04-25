import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  // NOTE: 회원 가입, 수정에만 사용할 수 있는 토큰
  getAuthCookieOptions(): CookieOptions {
    return {
      httpOnly: this.configService.get<boolean>('AUTH_COOKIE_HTTP_ONLY', true),
      secure: this.configService.get<boolean>('AUTH_COOKIE_SECURE', false),
      path: this.configService.get<string>('AUTH_COOKIE_PATH', '/'),
      domain: this.configService.get<string>('AUTH_COOKIE_DOMAIN', 'localhost'),
      maxAge: this.configService.get<number>('AUTH_COOKIE_MAX_AGE', 1800),
      sameSite: this.configService.get<boolean | 'lax' | 'strict' | 'none'>(
        'AUTH_COOKIE_SAME_SITE',
        'strict',
      ),
    };
  }

  getRefreshCookieOptions(): CookieOptions {
    return {
      httpOnly: this.configService.get<boolean>(
        'REFRESH_COOKIE_HTTP_ONLY',
        true,
      ),
      secure: this.configService.get<boolean>('REFRESH_COOKIE_SECURE', false),
      path: this.configService.get<string>('REFRESH_COOKIE_PATH', '/'),
      domain: this.configService.get<string>(
        'REFRESH_COOKIE_DOMAIN',
        'localhost',
      ),
      maxAge: this.configService.get<number>('REFRESH_COOKIE_MAX_AGE', 1800),
      sameSite: this.configService.get<boolean | 'lax' | 'strict' | 'none'>(
        'REFRESH_COOKIE_SAME_SITE',
        'strict',
      ),
    };
  }
}

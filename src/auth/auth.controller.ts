import { Body, Controller, Res } from '@nestjs/common';
import { Response } from 'express';

import { SendSms, VerificationSms } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'library/jwt/token.service';
import { CookieService } from 'library/cookie/cookie.service';

import { SendSmsBodyRequestDto } from 'src/auth/dto/send-sms.dto';
import { VerificationSmsBodyRequestDto } from 'src/auth/dto/verification-sms.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  @SendSms()
  async sendSms(@Body() { phone }: SendSmsBodyRequestDto) {
    this.authService.sendSms(phone);
    return null;
  }

  @VerificationSms()
  async verificationSms(
    @Body() { phone, code }: VerificationSmsBodyRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.verificationSms(phone, code);
    console.log(this.cookieService.getAuthCookieOptions());
    const authToken = await this.tokenService.generateAuthToken({ phone });
    response.cookie(
      'authToken',
      authToken,
      this.cookieService.getAuthCookieOptions(),
    );

    return null;
  }
}

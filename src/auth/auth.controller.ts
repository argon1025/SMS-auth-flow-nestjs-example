import { Body, Controller, Res } from '@nestjs/common';
import { Response } from 'express';

import {
  ChangePassword,
  GetAccessToken,
  JoinCustomer,
  Login,
  SendSms,
  VerificationSms,
} from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'library/jwt/token.service';
import { CookieService } from 'library/cookie/cookie.service';
import { JwtUserId } from 'library/decorator/auth-token.decorator';

import { SendSmsBodyRequestDto } from 'src/auth/dto/send-sms.dto';
import { VerificationSmsBodyRequestDto } from 'src/auth/dto/verification-sms.dto';
import { AuthTokenPayLoad } from 'library/jwt/type/auth-token-payload';
import { JoinCustomerBodyRequestDto } from 'src/auth/dto/join-customer.dto';
import { ChangePasswordBodyRequestDto } from 'src/auth/dto/change-password.dto';
import { LoginRequestBodyDto } from 'src/auth/dto/login.dto';
import { JwtRefreshTokenData } from 'library/decorator/refresh-token.decorator';
import { RefreshTokenPayLoad } from 'library/jwt/type/refresh-token-payload';
import { GetAccessTokenResponseDto } from 'src/auth/dto/get-access-token.dto';

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

    const authToken = await this.tokenService.generateAuthToken({ phone });
    response.cookie(
      'authToken',
      authToken,
      this.cookieService.getAuthCookieOptions(),
    );

    return null;
  }

  @JoinCustomer()
  async joinCustomer(
    @JwtUserId() { phone }: AuthTokenPayLoad,
    @Body() joinCustomerBodyRequestDto: JoinCustomerBodyRequestDto,
  ) {
    await this.authService.joinCustomer({
      phone,
      ...joinCustomerBodyRequestDto,
    });
    return null;
  }

  @ChangePassword()
  async changePassword(
    @JwtUserId() { phone }: AuthTokenPayLoad,
    @Body() { password }: ChangePasswordBodyRequestDto,
  ) {
    await this.authService.changePassword({ phone, password });
    return null;
  }

  @Login()
  async login(
    @Body() { id, password }: LoginRequestBodyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const customerData = await this.authService.validateCustomer(id, password);
    const refreshToken = await this.tokenService.generateRefreshToken({
      id: customerData.id,
    });
    response.cookie(
      'refreshToken',
      refreshToken,
      this.cookieService.getRefreshCookieOptions(),
    );
    return null;
  }

  @GetAccessToken()
  getAccessToken(
    @JwtRefreshTokenData() refreshTokenPayload: RefreshTokenPayLoad,
  ) {
    return new GetAccessTokenResponseDto({
      accessToken: this.tokenService.generateAccessToken({
        id: refreshTokenPayload.id,
      }),
    });
  }
}

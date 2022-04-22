import { Body, Controller } from '@nestjs/common';

import { SendSms } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';

import { SendSmsBodyRequestDto } from 'src/auth/dto/send-sms.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SendSms()
  async sendSms(@Body() { phone }: SendSmsBodyRequestDto) {
    this.authService.sendSms(phone);
    return null;
  }
}

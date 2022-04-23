import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Customers } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { SmsService } from 'library/sms/sms.service';
import { AuthRepository } from 'src/auth/auth.repository';
import { CryptoService } from 'library/crypto/crypto.service';
import { time } from 'library/date/date';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authRepository: AuthRepository,
    private readonly smsService: SmsService,
    private readonly cryptoService: CryptoService,
  ) {}

  private generateRandomCode() {
    return Math.floor(1000000 + Math.random() * 9900000);
  }

  async sendSms(phone: Customers['phone']) {
    // NOTE: 유저 등록 조회
    const userData = await this.authRepository.findFirstByPhone({
      prismaService: this.prismaService,
      phone,
    });

    // NOTE: 유저 데이터가 없다면
    if (!userData) {
      try {
        await this.authRepository.create({
          prismaService: this.prismaService,
          phone,
        });
      } catch (error) {
        // TODO: 에러 메시징
        throw new InternalServerErrorException();
      }
    }

    // NOTE: 인증 코드 생성 및 데이터 저장
    const CODE = this.generateRandomCode();
    await this.authRepository.setSmsCode({
      phone,
      code: CODE,
    });

    // NOTE: 인증번호 전송
    await this.smsService.send(`${CODE}`);

    return null;
  }

  async verificationSms(phone: Customers['phone'], code: number) {
    const result = await this.authRepository.getSmsCode({ phone });
    if (!result) throw new BadRequestException();

    if (result !== code) {
      await this.authRepository.deleteSmsCode({ phone });
      throw new BadRequestException();
    }

    await this.authRepository.deleteSmsCode({ phone });
    return true;
  }

  async joinCustomer({
    phone,
    nickname,
    name,
    email,
    password,
  }: {
    phone: Customers['phone'];
    nickname: Customers['nickname'];
    email: Customers['email'];
    name: Customers['name'];
    password: Customers['password'];
  }) {
    const hasJoin = await this.authRepository.findFirstByPhone({
      prismaService: this.prismaService,
      phone,
    });
    // NOTE: 생성된 계정이 아에 없는경우
    if (!hasJoin) throw new ForbiddenException();
    // NOTE: 이미 가입한 유저인경우
    if (hasJoin.joinedAt) throw new ForbiddenException();

    const hashedPassword = await this.cryptoService.encryptPassword(password);
    try {
      await this.authRepository.updateByPhone({
        prismaService: this.prismaService,
        phone,
        nickname,
        name,
        email,
        password: hashedPassword,
        joinedAt: time(),
      });
    } catch (error) {
      if (!this.prismaService.isPrismaError(error)) {
        throw new InternalServerErrorException();
      }

      throw new ForbiddenException();
    }
  }
}

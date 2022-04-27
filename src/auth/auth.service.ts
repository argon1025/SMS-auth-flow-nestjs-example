import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Customers } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { SmsService } from 'library/sms/sms.service';
import { AuthRepository } from 'src/auth/auth.repository';
import { CryptoService } from 'library/crypto/crypto.service';
import { time } from 'library/date/date';

import { REG_EMAIL, REG_PHONE } from 'library/constant/constant';
import {
  AlreadyJoinedError,
  AlreadyUsedUniqueValueError,
  MismatchVerificationError,
  MismatchVerificationPasswordError,
  NeedJoinError,
  NotFoundCustomerError,
  NotFoundVerificationError,
} from 'src/auth/type/auth.error.type';

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
    const customerData = await this.authRepository.findFirstByPhone({
      prismaService: this.prismaService,
      phone,
    });

    // NOTE: 유저 데이터가 없다면
    if (!customerData) {
      try {
        await this.authRepository.create({
          prismaService: this.prismaService,
          phone,
        });
      } catch (error) {
        if (!this.prismaService.isPrismaError(error)) {
          throw new InternalServerErrorException();
        }
        throw new ForbiddenException();
      }
    }

    // NOTE: 인증 코드 생성 및 데이터 저장
    const CODE = this.generateRandomCode();
    await this.authRepository.setSmsCode({
      phone,
      code: CODE,
    });

    // NOTE: 인증번호 전송
    this.smsService.send(`${CODE}`, phone);

    return null;
  }

  async verificationSms(phone: Customers['phone'], code: number) {
    const result = await this.authRepository.getSmsCode({ phone });
    if (!result) throw new BadRequestException(NotFoundVerificationError);

    if (result !== code) {
      await this.authRepository.deleteSmsCode({ phone });
      throw new BadRequestException(MismatchVerificationError);
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
    // NOTE: 이미 가입한 유저인경우
    if (hasJoin.joinedAt) throw new ForbiddenException(AlreadyJoinedError);

    const hashedPassword = this.cryptoService.encryptPassword(password);
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

      throw new ForbiddenException(AlreadyUsedUniqueValueError);
    }
  }

  async changePassword({
    phone,
    password,
  }: {
    phone: Customers['phone'];
    password: Customers['password'];
  }) {
    const hasJoin = await this.authRepository.findFirstByPhone({
      prismaService: this.prismaService,
      phone,
    });
    // NOTE: 회원가입 되지 않은 유저인 경우
    if (!hasJoin.joinedAt) throw new ForbiddenException(NeedJoinError);

    const hashedPassword = this.cryptoService.encryptPassword(password);
    await this.authRepository.updateByPhone({
      prismaService: this.prismaService,
      phone,
      password: hashedPassword,
    });
  }

  // NOTE: 이메일, 휴대폰, 닉네임에 일치하는 회원정보를 찾고 비밀번호를 비교해서 리턴한다
  async validateCustomer(customerId: string, plainPassword: string) {
    let customerData: Customers | null = null;
    if (REG_EMAIL.test(customerId)) {
      // NOTE: 이메일
      customerData = await this.authRepository.findFirstByEmail({
        prismaService: this.prismaService,
        email: customerId,
      });
    } else if (REG_PHONE.test(customerId)) {
      // NOTE: 휴대폰
      customerData = await this.authRepository.findFirstByPhone({
        prismaService: this.prismaService,
        phone: customerId,
      });
    } else {
      // NOTE: 닉네임
      customerData = await this.authRepository.findFirstByNickname({
        prismaService: this.prismaService,
        nickname: customerId,
      });
    }
    if (!customerData) throw new NotFoundException(NotFoundCustomerError);
    if (!customerData.joinedAt) throw new UnauthorizedException(NeedJoinError);

    const isCorrectPassword = this.cryptoService.comparePassword(
      plainPassword,
      customerData.password,
    );
    if (!isCorrectPassword)
      throw new UnauthorizedException(MismatchVerificationPasswordError);

    return customerData;
  }
}

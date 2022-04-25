import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Customers } from '@prisma/client';

import { time } from 'library/date/date';
import { PrismaService } from 'library/prisma/prisma.service';
import { RedisService } from 'library/redis/redis.service';

@Injectable()
export class AuthRepository {
  private readonly REDIS_VERIFICATION_CODE = {
    KEY: 'VERIFICATION',
    TTL: 120,
  };

  constructor(private readonly redisService: RedisService) {}

  create({
    prismaService,
    phone,
    nickname,
    name,
    password,
    joinedAt,
    deletedAt,
  }: {
    prismaService: PrismaService;
    phone: Customers['phone'];
    nickname?: Customers['nickname'];
    name?: Customers['name'];
    password?: Customers['password'];
    joinedAt?: Customers['joinedAt'];
    deletedAt?: Customers['deletedAt'];
  }) {
    return prismaService.customers.create({
      data: {
        phone,
        createdAt: time(),
        nickname,
        name,
        password,
        joinedAt,
        deletedAt,
      },
    });
  }

  findFirstByPhone({
    prismaService,
    phone,
  }: {
    prismaService: PrismaService;
    phone: Customers['phone'];
  }) {
    return prismaService.customers.findUnique({ where: { phone } });
  }

  findFirstByNickname({
    prismaService,
    nickname,
  }: {
    prismaService: PrismaService;
    nickname: Customers['nickname'];
  }) {
    return prismaService.customers.findUnique({ where: { nickname } });
  }

  findFirstByEmail({
    prismaService,
    email,
  }: {
    prismaService: PrismaService;
    email: Customers['email'];
  }) {
    return prismaService.customers.findUnique({ where: { email } });
  }

  updateByPhone({
    prismaService,
    phone,
    nickname,
    name,
    email,
    password,
    createdAt,
    joinedAt,
    deletedAt,
  }: {
    prismaService: PrismaService;
    phone: Customers['phone'];
    nickname?: Customers['nickname'];
    email?: Customers['email'];
    name?: Customers['name'];
    password?: Customers['password'];
    createdAt?: Customers['createdAt'];
    joinedAt?: Customers['joinedAt'];
    deletedAt?: Customers['deletedAt'];
  }) {
    return prismaService.customers.update({
      where: { phone },
      data: { nickname, email, name, password, deletedAt, createdAt, joinedAt },
    });
  }

  async setSmsCode({
    phone,
    code,
  }: {
    phone: Customers['phone'];
    code: number;
  }) {
    try {
      await this.redisService.set(
        `${this.REDIS_VERIFICATION_CODE.KEY}:${phone}`,
        code,
        { ttl: this.REDIS_VERIFICATION_CODE.TTL },
      );
      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  getSmsCode({ phone }: { phone: Customers['phone'] }) {
    return this.redisService.get<number>(
      `${this.REDIS_VERIFICATION_CODE.KEY}:${phone}`,
    );
  }

  deleteSmsCode({ phone }: { phone: Customers['phone'] }) {
    return this.redisService.delete(
      `${this.REDIS_VERIFICATION_CODE.KEY}:${phone}`,
    );
  }
}

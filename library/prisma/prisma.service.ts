import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  // NOTE:  NestJS 종료 이벤트가 실행되기 전에 Prisma는 process.exit()를 호출하기때문에 해당 이벤트 수신 구문을 추가한다
  // https://github.com/prisma/prisma/issues/2917#issuecomment-708340112
  async onModuleDestroy() {
    this.$on('beforeExit', async () => {
      await this.$disconnect();
    });
  }
}

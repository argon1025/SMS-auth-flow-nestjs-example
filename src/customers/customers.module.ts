import { Module } from '@nestjs/common';

import { PrismaModule } from 'library/prisma/prisma.module';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  imports: [PrismaModule],
  providers: [CustomersService],
  controllers: [CustomersController],
})
export class CustomersModule {}

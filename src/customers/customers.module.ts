import { Module } from '@nestjs/common';

import { PrismaModule } from 'library/prisma/prisma.module';
import { CustomersRepository } from 'src/customers/customers.repository';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  imports: [PrismaModule],
  providers: [CustomersService, CustomersRepository],
  controllers: [CustomersController],
})
export class CustomersModule {}

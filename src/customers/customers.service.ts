import { Injectable } from '@nestjs/common';
import { Customers } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { CustomersRepository } from 'src/customers/customers.repository';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customersRepository: CustomersRepository,
  ) {}

  getCustomerInfo(customerId: Customers['id']) {
    return this.customersRepository.findFirstById({
      prismaService: this.prismaService,
      id: customerId,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Customers } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';

@Injectable()
export class CustomersRepository {
  findFirstById({
    prismaService,
    id,
  }: {
    prismaService: PrismaService;
    id: Customers['id'];
  }) {
    return prismaService.customers.findUnique({ where: { id } });
  }
}

import { Customers } from '@prisma/client';

export interface AuthTokenPayLoad {
  phone: Customers['phone'];
}

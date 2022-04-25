import { Customers } from '@prisma/client';

export interface AccessTokenPayLoad {
  id: Customers['id'];
}

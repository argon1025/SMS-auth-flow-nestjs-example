import { Customers } from '@prisma/client';

export interface RefreshTokenPayLoad {
  id: Customers['id'];
}

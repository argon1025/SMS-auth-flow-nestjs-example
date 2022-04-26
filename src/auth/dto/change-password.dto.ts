import { Customers } from '@prisma/client';
import { IsString, Length } from 'class-validator';

export class ChangePasswordBodyRequestDto {
  @IsString()
  @Length(7, 30)
  readonly password: Customers['password'];
}

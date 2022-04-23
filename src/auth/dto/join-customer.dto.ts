import { Customers } from '@prisma/client';
import { IsEmail, IsString, Length } from 'class-validator';

export class JoinCustomerBodyRequestDto {
  @IsString()
  readonly nickname: Customers['nickname'];

  @IsEmail()
  @Length(1, 49)
  readonly email: Customers['email'];

  @IsString()
  @Length(1, 14)
  readonly name: Customers['name'];

  @IsString()
  @Length(1, 30)
  readonly password: Customers['password'];
}

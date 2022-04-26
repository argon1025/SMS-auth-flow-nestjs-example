import { Customers } from '@prisma/client';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ONLY_TEXT } from 'library/constant/constant';

export class JoinCustomerBodyRequestDto {
  @Matches(ONLY_TEXT, { message: 'nickname must be text' })
  @Length(3, 14)
  readonly nickname: Customers['nickname'];

  @IsEmail()
  @Length(5, 49)
  readonly email: Customers['email'];

  @IsString()
  @Length(2, 14)
  readonly name: Customers['name'];

  @IsString()
  @Length(7, 30)
  readonly password: Customers['password'];
}

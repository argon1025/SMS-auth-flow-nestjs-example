import { Customers } from '@prisma/client';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 49)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  password: Customers['password'];
}

import { Customers } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, Matches } from 'class-validator';
import { REG_PHONE } from 'library/constant/constant';

export class SendSmsBodyRequestDto {
  @Matches(REG_PHONE, { message: 'phone must match 000-0000-0000' })
  @IsString()
  @Type(() => String)
  readonly phone: Customers['phone'];
}

import { Customers } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Matches, Max, Min } from 'class-validator';

import { REG_PHONE } from 'library/constant/constant';

export class VerificationSmsBodyRequestDto {
  @Matches(REG_PHONE, { message: 'phone must match 000-0000-0000' })
  @IsString()
  @Type(() => String)
  readonly phone: Customers['phone'];

  @IsNumber()
  @Type(() => Number)
  @Max(9899999)
  @Min(999999)
  readonly code: number;
}

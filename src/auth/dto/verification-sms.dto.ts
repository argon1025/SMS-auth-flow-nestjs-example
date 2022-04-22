import { Customers } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsMobilePhone, IsNumber, IsString, Max, Min } from 'class-validator';

export class VerificationSmsBodyRequestDto {
  // NOTE: 반드시 국가 코드를 입력해야합니다
  @IsMobilePhone('ko-KR', { strictMode: true })
  @IsString()
  @Transform(({ value }) => {
    return String(value).replace(/ |-/g, '').replace('+82010', '+8210');
  })
  readonly phone: Customers['phone'];

  @IsNumber()
  @Type(() => Number)
  @Max(9899999)
  @Min(999999)
  readonly code: number;
}

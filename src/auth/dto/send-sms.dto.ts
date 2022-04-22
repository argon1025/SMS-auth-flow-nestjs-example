import { Customers } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsMobilePhone, IsString } from 'class-validator';

export class SendSmsBodyRequestDto {
  // NOTE: 반드시 국가 코드를 입력해야합니다
  @IsMobilePhone('ko-KR', { strictMode: true })
  @IsString()
  // TODO: 더 나은방법이 있는지 찾아보자
  @Transform(({ value }) => {
    return String(value).replace(/ |-/g, '').replace('+82010', '+8210');
  })
  readonly phone: Customers['phone'];
}

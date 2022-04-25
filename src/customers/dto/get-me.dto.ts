import { ApiProperty } from '@nestjs/swagger';
import { Customers } from '@prisma/client';

export class GetMeResponseDto {
  @ApiProperty({ nullable: true })
  name: Customers['name'];

  @ApiProperty({ nullable: true })
  nickname: Customers['nickname'];

  @ApiProperty({ nullable: true })
  email: Customers['email'];

  phone: Customers['phone'];

  @ApiProperty({ nullable: true })
  joinedAt: Customers['joinedAt'];

  constructor(required: Required<GetMeResponseDto>) {
    Object.assign(this, required);
  }
}

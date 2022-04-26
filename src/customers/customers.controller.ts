import { Controller, UnauthorizedException } from '@nestjs/common';

import { JwtAccessTokenData } from 'library/decorator/access-token.decorator';
import { GetMe } from 'src/customers/customers.decorator';
import { CustomersService } from 'src/customers/customers.service';

import { AccessTokenPayLoad } from 'library/jwt/type/access-token-payload.type';
import { GetMeResponseDto } from 'src/customers/dto/get-me.dto';
import { UnauthorizedError } from 'library/jwt/type/jwt.error.type';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @GetMe()
  async getMe(@JwtAccessTokenData() { id }: AccessTokenPayLoad) {
    if (!id) throw new UnauthorizedException(UnauthorizedError);
    const { name, nickname, email, phone, joinedAt } =
      await this.customerService.getCustomerInfo(id);
    return new GetMeResponseDto({ name, nickname, email, phone, joinedAt });
  }
}

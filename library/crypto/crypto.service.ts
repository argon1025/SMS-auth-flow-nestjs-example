import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  async encryptPassword(data: string) {
    try {
      const result = await bcrypt.hash(
        data,
        await this.configService.get<number>('SALT_ROUND', 10),
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

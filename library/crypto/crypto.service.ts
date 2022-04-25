import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  encryptPassword(data: string) {
    try {
      const saltRound = this.configService.get<number>('SALT_ROUND', 10);
      const result = bcrypt.hashSync(data, Number(saltRound));
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  comparePassword(plainData: string, hashedData: string) {
    try {
      const result = bcrypt.compareSync(plainData, hashedData);
      return result;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

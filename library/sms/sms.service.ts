import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  // NOTE: 실제 서비스 연결을 대신한다
  send(code: string, to: string) {
    Logger.log(`${to} -> 유저 인증번호 [${code}]를 입력해 주세요!`);
  }
}

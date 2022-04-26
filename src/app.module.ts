import {
  BadRequestException,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { CountryCode } from 'library/constant/constant';
import { AllExceptionsFilter } from 'library/exception/all-exception.filter';
import { ExceptionMessageInterface } from 'library/exception/type/custom-exception-message.type';

import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    AuthModule,
    CustomersModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // NOTE: JSON 페이로드를 DTO 프로퍼티에 지정된 타입으로 변환합니다
        transform: true,
        // NOTE: validation 데코레이터가 없는 모든 프로퍼티에 제거한다
        whitelist: true,
        // NOTE: 알수없는 프로퍼티가 유효성 검사를 통과하는것을 막습니다
        forbidUnknownValues: true,
        exceptionFactory: (errors: ValidationError[]) => {
          if (!errors[0]?.constraints) return new BadRequestException();
          const firstKey = Object.keys(errors[0].constraints);
          const errorMessage: ExceptionMessageInterface = {
            [CountryCode.EN]: errors[0].constraints[`${firstKey}`],
          };
          return new BadRequestException(errorMessage);
        },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}

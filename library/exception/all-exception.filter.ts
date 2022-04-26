import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  CustomExceptionResponseInterface,
  isCustomExceptionMessageInterface,
} from 'library/exception/type/custom-exception-message.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    // NOTE: HTTPException이 아닌지
    const isHttpException = exception instanceof HttpException;
    // NOTE: HttpException이 아니면 500 에러 코드를 할당한다
    const httpStatusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    // NOTE: HTTPException일 경우에만 에러 메시지를 들고온다
    const exceptionData = isHttpException ? exception.getResponse() : null;
    // NOTE: CustomExceptionMessage인지 체크한다
    const isCustomMessage = isCustomExceptionMessageInterface(exceptionData);

    // NOTE: 에러 메시지를 작성한다
    const responseData: CustomExceptionResponseInterface = {
      statusCode: httpStatusCode,
      location: request.url,
      message: isCustomMessage ? exceptionData : undefined,
    };

    // TODO: 개발 진행중 500 에러 모니터링 수단, 배포시 APM으로 연동해야한다
    if (httpStatusCode === HttpStatus.INTERNAL_SERVER_ERROR)
      Logger.error(exception);

    httpAdapter.reply(ctx.getResponse(), responseData, httpStatusCode);
  }
}

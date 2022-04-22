import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { swaggerDocumentBuilder } from 'library/swagger/swagger-document.bootstrap';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerDocumentBuilder(app);

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { swaggerDocumentBuilder } from 'library/swagger/swagger-document.bootstrap';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerDocumentBuilder(app);
  await app.listen(3000);
}
bootstrap();

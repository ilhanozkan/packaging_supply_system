import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ProductTypeService } from './product-type/product-type.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 8080;

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  // ProductType mock data initialization
  const productTypeService = app.get(ProductTypeService);
  await productTypeService.initializeProductTypes();

  await app.listen(port);

  Logger.log(`Server is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap().catch(console.error);

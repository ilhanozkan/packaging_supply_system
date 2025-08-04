import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ProductTypeService } from './product-type/product-type.service';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // ProductType mock data initialization
  const productTypeService = app.get(ProductTypeService);
  await productTypeService.initializeProductTypes();

  await app.listen(PORT);

  Logger.log(`Server is running on: http://localhost:${PORT}`, 'Bootstrap');
}
bootstrap().catch(console.error);

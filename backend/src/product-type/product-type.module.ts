import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductType } from './entity/product-type.entity';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType]), AuthModule],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [TypeOrmModule, ProductTypeService],
})
export class ProductTypeModule {}

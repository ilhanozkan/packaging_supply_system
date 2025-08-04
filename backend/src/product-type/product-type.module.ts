import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductType } from './entity/product-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [TypeOrmModule, ProductTypeService],
})
export class ProductTypeModule {}

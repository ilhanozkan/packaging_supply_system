import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderRequestController } from './order-request.controller';
import { OrderRequestService } from './order-request.service';
import { OrderRequest } from './entity/order-request.entity';

import { User } from '../user/user.entity';
import { OrderItem } from '../order-item/entity/order-item.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductType } from '../product-type/entity/product-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRequest, OrderItem, User, ProductType]),
    AuthModule,
  ],
  controllers: [OrderRequestController],
  providers: [OrderRequestService],
  exports: [TypeOrmModule, OrderRequestService],
})
export class OrderRequestModule {}

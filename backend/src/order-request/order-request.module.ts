import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderRequestController } from './order-request.controller';
import { OrderRequestService } from './order-request.service';
import { OrderRequest } from './entity/order-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequest])],
  controllers: [OrderRequestController],
  providers: [OrderRequestService],
})
export class OrderRequestModule {}

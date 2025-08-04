import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupplierInterestService } from './supplier-interest.service';
import { SupplierInterestController } from './supplier-interest.controller';
import { SupplierInterest } from './entity/supplier-interest.entity';

import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInterest, User])],
  providers: [SupplierInterestService],
  controllers: [SupplierInterestController],
  exports: [TypeOrmModule, SupplierInterestService],
})
export class SupplierInterestModule {}

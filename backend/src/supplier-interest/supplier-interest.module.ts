import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupplierInterestService } from './supplier-interest.service';
import { SupplierInterestController } from './supplier-interest.controller';
import { SupplierInterest } from './entity/supplier-interest.entity';

import { User } from '../user/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierInterest, User]), AuthModule],
  providers: [SupplierInterestService],
  controllers: [SupplierInterestController],
  exports: [TypeOrmModule, SupplierInterestService],
})
export class SupplierInterestModule {}

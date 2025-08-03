import { Module } from '@nestjs/common';

import { SupplierInterestService } from './supplier-interest.service';
import { SupplierInterestController } from './supplier-interest.controller';

@Module({
  providers: [SupplierInterestService],
  controllers: [SupplierInterestController],
})
export class SupplierInterestModule {}

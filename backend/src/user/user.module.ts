import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './user.entity';
import { AdminController } from './admin.controller';

import { ProductType } from '../product-type/entity/product-type.entity';
import { ProductTypeService } from '../product-type/product-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProductType])],
  controllers: [AdminController],
  providers: [UserService, ProductTypeService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductTypeModule } from './product-type/product-type.module';
import { UserModule } from './user/user.module';

import ormConfig from '../ormconfig.json';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig as TypeOrmModuleOptions),
    ProductTypeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

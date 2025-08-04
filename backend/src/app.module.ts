import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductTypeModule } from './product-type/product-type.module';
import { UserModule } from './user/user.module';
import { OrderRequestModule } from './order-request/order-request.module';
import { SupplierInterestModule } from './supplier-interest/supplier-interest.module';
import { AuthModule } from './auth/auth.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { OrderItemModule } from './order-item/order-item.module';

import ormConfig from '../ormconfig.json';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig as TypeOrmModuleOptions),
    ProductTypeModule,
    UserModule,
    OrderRequestModule,
    SupplierInterestModule,
    AuthModule,
    OrderItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}

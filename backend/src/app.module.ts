import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
import configuration, { Configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Configuration>) => {
        const dbConfig = configService.get('database', { infer: true });

        if (!dbConfig) throw new Error('Database configuration is required');

        return {
          type: 'postgres' as const,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          entities: dbConfig.entities,
        };
      },
      inject: [ConfigService],
    }),
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

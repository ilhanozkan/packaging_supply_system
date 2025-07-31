import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductTypeModule } from './product-type/product-type.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      database: 'packaging_supply_system',
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      logging: true,
      entities: ['./src/**/*.entity.ts', './src/**/*.entity.js'],
    }),
    ProductTypeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

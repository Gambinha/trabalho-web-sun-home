import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './core/guards/auth.guard';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import 'dotenv/config';
import { ProductModule } from './features/product/product.module';
import { ProductVariationModule } from './features/product-variation/product-variation.module';
import { SalesModule } from './features/sales/sales.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET,
    }),
    ConfigModule,
    UserModule,
    AuthModule,
    ProductModule,
    ProductVariationModule,
    SalesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

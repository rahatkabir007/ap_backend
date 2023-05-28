import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PortfolioModule } from './portfolio/portfolio.module';
import { PictureModule } from './picture/picture.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EncryptInterceptor } from "./interceptors/encrypt.interceptor";
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? ""
    ),
    PortfolioModule,
    PictureModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: EncryptInterceptor,
    },
  ],


})
export class AppModule { }

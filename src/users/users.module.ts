import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User, UserSchema } from "./schemas/user.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Picture, PictureSchema } from "src/picture/schemas/picture.schema";
import { Portfolio, PortfolioSchema } from "src/portfolio/schemas/portfolio.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Picture.name, schema: PictureSchema }, { name: Portfolio.name, schema: PortfolioSchema }]), PassportModule,
  JwtModule.register({
    secret: `${process.env.JWT_SECRET_KEY}`,
    signOptions: { expiresIn: '3000s' },
  }),],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],

})
export class UsersModule { }
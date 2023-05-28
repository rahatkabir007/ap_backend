import { Module } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { PortfolioController } from "./portfolio.controller";
import { Portfolio, PortfolioSchema } from "./schemas/portfolio.schema";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Picture,
  PictureSchema,
} from "./../picture/schemas/picture.schema";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: '3000s' },
    })
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, JwtStrategy],
})
export class PortfolioModule { }

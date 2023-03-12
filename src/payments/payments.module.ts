import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from 'src/portfolio/schemas/portfolio.schema';
import { Picture, PictureSchema } from 'src/picture/schemas/picture.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Pricing, PricingSchema } from './schemas/pricing.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pricing.name, schema: PricingSchema },
    ]),
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
    MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService,
    JwtStrategy
  ]
})
export class PaymentsModule { }

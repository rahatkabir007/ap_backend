import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Picture, PictureSchema } from './schemas/picture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Picture.name, schema: PictureSchema },
    ]),
  ],
  controllers: [PictureController],
  providers: [PictureService],
})
export class PictureModule { }

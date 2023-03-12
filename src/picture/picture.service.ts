import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { Picture, PictureDocument } from './schemas/picture.schema';

@Injectable()
export class PictureService {
  constructor(
    @InjectModel(Picture.name) private pictureModel: Model<PictureDocument>
  )
  // eslint-disable-next-line no-empty-function  
  { }
  async create(createPictureDto: CreatePictureDto) {
    return new this.pictureModel(createPictureDto).save();
  }

  async findAll() {
    return await this.pictureModel.find()
  }

  async findOne(id: string) {
    return await this.pictureModel.find({
      _id: id
    })
  }

  async update(id: string, updatePictureDto: UpdatePictureDto) {
    if (updatePictureDto?.name?.length > 25) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    if (updatePictureDto?.description?.length > 300) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }

    const pic = await this.pictureModel.updateOne({
      _id: id
    },
      { $set: updatePictureDto },
      { new: true }
    )

    return pic
  }

  async deleteOne(url: string) {
    return await this.pictureModel.deleteOne(
      {
        url: url,
      },
    );
  }
  async deleteMany() {
    await this.pictureModel.deleteMany();
  }
}


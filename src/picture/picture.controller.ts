import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PictureService } from './picture.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';

@Controller("picture")
export class PictureController {
  // eslint-disable-next-line no-empty-function
  constructor(private readonly pictureService: PictureService) { }

  @Post()
  async create(@Body() createPictureDto: CreatePictureDto) {
    return await this.pictureService.create(createPictureDto);
  }

  @Get()
  async findAll() {
    return await this.pictureService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.pictureService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return await this.pictureService.update(id, updatePictureDto);
  }

  @Delete()
  async deleteMany() {
    await this.pictureService.deleteMany();
  }
}

import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { AuthGuard } from "@nestjs/passport";
import { QueryDto } from './dto/query.dto';
import { User } from 'src/users/schemas/user.schema';

export interface IUser extends User {
  _id: string
}

export interface MyReq extends Request {
  user: IUser,
}

@Controller("portfolio")
// @UseInterceptors(EncryptInterceptor)
export class PortfolioController {
  // eslint-disable-next-line no-empty-function
  constructor(private readonly portfolioService: PortfolioService) { }



  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(@Request() req: MyReq, @Body() createPortfolioDto: CreatePortfolioDto) {
    // // console.log('kk',req.user._id)
    return await this.portfolioService.create(createPortfolioDto, req.user._id);
  }


  @UseGuards(AuthGuard("jwt"))
  @Post("testToken")

  async testToken(@Request() req: MyReq) {
    return await req.user;
  }

  // @UseGuards(AuthGuard("jwt"))
  @Get()
  async findAll(@Query() queries: QueryDto, @Request() req: Request) {
    console.log('queries', queries)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token: string = req.headers['authorization'];
    // return await this.portfolioService.findAll2(queries, token);
    return await this.portfolioService.findAll(queries, token);
  }


  // @UseGuards(AuthGuard("jwt"))
  @Get(":slug")
  async findOne(@Param("slug") slug: string, @Query() queries: QueryDto) {
    return await this.portfolioService.findOne(slug, queries);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":slug")
  async deleteOne(@Param("slug") slug: string) {
    return await this.portfolioService.deletePortfolio(slug);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":slug")
  async update(
    @Request() req: MyReq, @Param("slug") slug: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto
  ) {
    console.log(req);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token: string = req.headers['authorization'];
    return await this.portfolioService.updatePortfolio(slug, req.user._id, updatePortfolioDto, token);
  }
}

import { User } from 'src/users/schemas/user.schema';
import { Controller, Get, Post, Body, Request, Delete, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { TestLoginUserDto } from './dto/testLogin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Param } from '@nestjs/common/decorators';


export interface MyReq {
  user: User
}

@Controller("users")
export class UsersController {
  // eslint-disable-next-line no-empty-function
  constructor(private readonly usersService: UsersService) { }

  @Post("/login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @Post("/testLogin")
  async testLogin(@Body() loginUserDto: TestLoginUserDto) {
    return await this.usersService.testLogin(loginUserDto);
  }

  @Get("/profile")
  @UseGuards(AuthGuard("jwt"))
  async getUserData(@Request() req: MyReq) {
    console.log(req)
    return await this.usersService.getUserData(req.user['email']);
  }

  @Get(":portfolioUserSlug")
  // @UseGuards(AuthGuard("jwt"))
  async getProfile(@Param("portfolioUserSlug") portfolioUserSlug: string,) {
    return await this.usersService.getUserDetails(portfolioUserSlug);
  }

  @Put("/")
  @UseGuards(AuthGuard("jwt"))
  async updateProfile(@Request() req: MyReq, @Body() body: UpdateUserDto) {
    return await this.usersService.updateUser(req.user['email'], body);
  }

  @Delete()
  async Delete() {
    await this.usersService.delete();
  }

}
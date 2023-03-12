import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { TokenVerifier } from 'src/utils/TokenVerifier';
import { TestLoginUserDto } from './dto/testLogin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Portfolio, PortfolioDocument } from 'src/portfolio/schemas/portfolio.schema';
import { Picture, PictureDocument } from 'src/picture/schemas/picture.schema';
import { Utils } from 'src/utils/Utils';




@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>,
    @InjectModel(Picture.name) private pictureModel: Model<PictureDocument>,
    private jwtService: JwtService
    // eslint-disable-next-line no-empty-function
  ) { }

  // async createUser(body) {
  //   this.userModel.create(body)
  //   return 1
  // }

  // async getSlug(fullName: string) {
  //   const count = await this.userModel.count({ fullName: fullName });
  //   if (count === 0) {
  //     const slug = fullName.toLowerCase().split(" ").join("_")
  //     return slug
  //   }
  //   else {
  //     const slug = fullName.toLowerCase().split(" ").join("_") + count
  //     return slug
  //   }

  // }

  async login(loginUserDto: LoginUserDto): Promise<{ slug: string | undefined, access_token: string | null, userId?: string | null }> {
    const { token, tokenType } = loginUserDto;
    let isVerified = false;
    const accessToken = null;

    if (tokenType == "facebook") {
      isVerified = await TokenVerifier.verifyFacebookToken(token);
    }
    else if (tokenType == "google") {
      isVerified = await TokenVerifier.verifyGoogleToken(token);
    }

    // console.log(`isVerified: ${isVerified}`);

    if (isVerified) {
      const { email, fullName } = loginUserDto;

      // console.log(`email: ${email}`);
      // console.log(`fullName: ${fullName}`);

      const user = await this.userModel.findOne({ email: email });

      if (user?.avatar) {
        delete loginUserDto.avatar
      }

      if (user) {
        loginUserDto['slug'] = user.slug
      }
      else {
        loginUserDto['slug'] = Utils.getUniqueId(fullName)
      }


      const creatUser = await this.userModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            ...loginUserDto,
          }
        },
        { upsert: true, new: true }
      );
      const accessToken = this.jwtService.sign({
        _id: creatUser._id as string,
        email: creatUser.email,
      });

      return {
        slug: loginUserDto['slug'],
        access_token: accessToken,
        userId: creatUser._id as string,
      };
    }

    return {
      slug: loginUserDto['slug'],
      access_token: accessToken,
    };
  }

  async getUserDetails(portfolioUserSlug: string): Promise<{ userDetails: User | null | FlattenMaps<User> | undefined, totalPortfolios: number, totalPictures: number }> {
    const userDetails = await this.userModel.findOne({ slug: portfolioUserSlug })

    const totalPortfolios = await this.portfolioModel.count({
      userSlug: userDetails?.slug as string
    })

    const totalPictures = await this.pictureModel.count({
      userId: userDetails?._id as string
    })
    const user: FlattenMaps<User> | undefined = userDetails?.toJSON()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete user?._id;
    return { userDetails: user, totalPortfolios, totalPictures }
  }

  async getUserData(email: string): Promise<{ userDetails: User | null, totalPortfolios: number, totalPictures: number }> {
    const userDetails = await this.userModel.findOne({ email: email })

    const totalPortfolios = await this.portfolioModel.count({
      userSlug: userDetails?.slug as string
    })

    const totalPictures = await this.pictureModel.count({
      userSlug: userDetails?.slug as string
    })

    return { userDetails, totalPortfolios, totalPictures }
  }


  async updateUser(email: string, body: UpdateUserDto) {
    if (body?.fullName?.length > 30) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    if (body?.occupation?.length > 30) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    if (body?.mainTitle?.length > 25) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    delete body?.email
    const uuu = await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: body },
      { new: true }
    );
    return uuu
  }

  async testLogin(loginUserDto: TestLoginUserDto): Promise<{ loginUserDto: TestLoginUserDto, access_token: string | null }> {
    const { email, fullName } = loginUserDto;

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      loginUserDto['slug'] = Utils.getUniqueId(fullName)
    }

    const creatUser = await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: loginUserDto, occupation: "CEO" },
      { upsert: true, new: true }
    );
    const accessToken = this.jwtService.sign({
      _id: creatUser._id as string,
      email: creatUser.email,
    });

    return {
      loginUserDto,
      access_token: accessToken,
    };
  }

  async delete(): Promise<void> {
    await this.userModel.deleteMany();
  }


}

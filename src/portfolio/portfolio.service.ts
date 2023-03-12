import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, PipelineStage } from "mongoose";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { Portfolio, PortfolioDocument } from "./schemas/portfolio.schema";
import { Picture, PictureDocument } from "./../picture/schemas/picture.schema";
import { QueryDto } from "./dto/query.dto";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { Utils } from "src/utils/Utils";
import { JwtService } from "@nestjs/jwt";

export interface IPicures {
  _id?: number,
  deleted?: boolean
  added?: boolean
  portfolioId: string
  url: string
  userId: string
}

export interface IPortfolio {
  _id: string
  name: string
  description: string
  pictures: Array<IPicures> | (Picture)[]
  totalPictures: number
  slug: string
  privacy: string
  year: string,
  userSlug: string | undefined
  color: string | undefined
}

export interface IFindAllPortfolio {
  arr: Array<IPortfolio>,
  userDetails: User | null
}

export interface IUser extends User {
  _id: string
}

export interface ITokenObj {
  _id?: string | null,
  email?: string | null,
  iat?: number | null,
  exp?: number | null
}



@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
    @InjectModel(Picture.name)
    private pictureModel: Model<PictureDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService
    // eslint-disable-next-line no-empty-function
  ) { }

  async create(createPortfolioDto: CreatePortfolioDto, userId: string): Promise<Portfolio | null> {
    const userInfo = await this.userModel.findOne({ _id: userId })
    // console.log('userInfo', userInfo)
    if (!userInfo) {
      return null;
    }

    // const totalPortfolio = await this.portfolioModel.count({ userId: userId })
    const portfolioSlug = `${userInfo.slug}_${Utils.getUniqueId("")}`

    if (createPortfolioDto?.name?.length > 30) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    if (createPortfolioDto?.description?.length > 300) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }

    const portfolio = await this.portfolioModel.create({
      name: createPortfolioDto.name,
      description: createPortfolioDto.description,
      userId: userId,
      year: createPortfolioDto.year,
      privacy: createPortfolioDto.privacy,
      slug: portfolioSlug,
      userSlug: userInfo?.slug,
    });
    const portfolioId = portfolio._id as string;
    const portfolioPictures = createPortfolioDto.pictures.split(" ");
    for (let int = 0; int < portfolioPictures.length; int++) {
      await this.pictureModel.create({
        url: portfolioPictures[int],
        userId: userId,
        portfolioId: portfolioId,
        serial: int + 1
      });
    }
    return portfolio;
  }

  getUserIdFromToken(token: string) {
    const tokenObj = this.jwtService.decode(token?.toString()?.replace("Bearer ", "")) as ITokenObj
    return tokenObj?._id;
  }

  async findAll(query: QueryDto, token: string) {
    console.log(query)
    const userIdFromToken = this.getUserIdFromToken(token)
    console.log(userIdFromToken)

    const userDetails = await this.userModel.findOne({
      slug: query.slug
    })

    const isOriginalUser = userIdFromToken?.toString() === userDetails?._id?.toString()


    const finalQueryObj: FilterQuery<PortfolioDocument> = {
      userSlug: userDetails?.slug,
    }
    if (!isOriginalUser) {
      finalQueryObj['privacy'] = "public"
    }
    const totalPortfolios = await this.portfolioModel.count(finalQueryObj)
    let limit: number = parseInt(query.limit) || 2
    const page: number = parseInt(query.page) || 1
    const arr: Array<IPortfolio> = [];
    if (limit === -1) {
      limit = 0
    }
    const usersPortfolios = await this.portfolioModel.find(finalQueryObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: "asc" })
      .exec();

    await Promise.all(
      usersPortfolios.map(async (userPortfolio, index) => {
        const pictures = await this.pictureModel.find({
          serial: userPortfolio.coverImage,
          portfolioId: usersPortfolios[index]._id,
        }).sort({ createdAt: "asc" }).exec();
        const lengthOfPictures = await this.pictureModel.count({
          // serial: p.coverImage,
          portfolioId: usersPortfolios[index]._id,
        })

        arr[index] = ({
          _id: usersPortfolios[index]._id,
          name: usersPortfolios[index].name,
          description: usersPortfolios[index].description,
          pictures: pictures,
          totalPictures: lengthOfPictures,
          slug: usersPortfolios[index].slug,
          privacy: usersPortfolios[index].privacy,
          year: usersPortfolios[index].year,
          userSlug: userDetails?.slug,
          color: userDetails?.color
        });
      })
    );

    return { arr, userDetails, totalPortfolios }

  }

  async findAll2(query: QueryDto, token: string) {
    console.log(query)
    const userIdFromToken = this.getUserIdFromToken(token)
    console.log(userIdFromToken)

    const userDetails = await this.userModel.findOne({
      slug: query.slug
    })

    const isOriginalUser = userIdFromToken?.toString() === userDetails?._id?.toString()

    const finalQueryObj: FilterQuery<PortfolioDocument> = {
      userSlug: userDetails?.slug,
    }
    if (!isOriginalUser) {
      finalQueryObj['privacy'] = "public"
    }
    const totalPortfolios = await this.portfolioModel.count(finalQueryObj)
    let limit: number = parseInt(query.limit) || 10
    const page: number = parseInt(query.page) || 1
    const arr: Array<IPortfolio> = [];
    if (limit === -1) {
      limit = 0
    }
    const usersPortfolios = await this.portfolioModel.find(finalQueryObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: "asc" })
      .exec();

    const queryObj: FilterQuery<PictureDocument> = {
      $or: []
    }
    const matchObj: PipelineStage = {
      $match: {
        $or: []
      }
    }

    for (let i = 0; i < usersPortfolios.length; i++) {
      queryObj?.$or?.push({
        serial: usersPortfolios[i].coverImage,
        portfolioId: usersPortfolios[i]._id,
      })

      matchObj?.$match?.$or?.push({
        portfolioId: usersPortfolios[i]._id as string,
      })
    }

    const pictures = await this.pictureModel.find(queryObj || {}).limit(usersPortfolios.length)

    const counts = await this.pictureModel
      .aggregate([
        {
          $match: matchObj.$match || {}
        },
        { $group: { "_id": "$portfolioId", "number": { $sum: 1 } } },
      ])

    function getPictureArray(portfolioId: string): Array<Picture> {
      const arr = []
      for (let i = 0; i < pictures.length; i++) {
        if (pictures[i].portfolioId.toString() == portfolioId) {
          arr.push(pictures[i])
          break
        }
      }

      return arr;
    }

    function getPictureCount(portfolioId: string): number {
      for (let i = 0; i < counts.length; i++) {
        if (counts[i]?._id?.toString() == portfolioId) {
          return (counts[i]?.number as number);
        }
      }
      return 0
    }

    for (let index = 0; index < usersPortfolios.length; index++) {
      const portfolioId = usersPortfolios[index]?._id?.toString() as string
      arr[index] = ({
        _id: portfolioId,
        name: usersPortfolios[index].name,
        description: usersPortfolios[index].description,
        pictures: getPictureArray(portfolioId),
        totalPictures: getPictureCount(portfolioId),
        slug: usersPortfolios[index].slug,
        privacy: usersPortfolios[index].privacy,
        year: usersPortfolios[index].year,
        userSlug: userDetails?.slug,
        color: userDetails?.color
      });
    }

    return { arr, userDetails, totalPortfolios }
  }

  async findOne(slug: string, query: QueryDto): Promise<Portfolio | null> {

    const portfolio = await this.portfolioModel.findOne({
      slug: slug,
    });
    const userDetails = await this.userModel.findOne({
      slug: portfolio?.userSlug,
    });
    if (!portfolio) {
      return null
    }
    const limit = parseInt(query.limit) || 5;
    const page = query.page || 1;

    // TODO: Shorten the code
    if (limit === -1) {
      const pictures = await this.pictureModel.find({
        portfolioId: portfolio._id as string,
      }).sort({
        serial: 1
      })

      if (!pictures) {
        return null;
      }
      const portfolioPictures = {
        _id: portfolio._id as string,
        name: portfolio.name,
        description: portfolio.description,
        year: portfolio.year,
        privacy: portfolio.privacy,
        coverImage: portfolio.coverImage,
        userSlug: portfolio?.userSlug,
        pictures: pictures,
        slug: portfolio.slug,
        style: portfolio.style,
        color: userDetails?.color,
      };
      // console.log('pp1', portfolioPictures);
      return portfolioPictures;
    }

    const pictures = await this.pictureModel.find({
      portfolioId: portfolio._id as string,
    }).limit(limit).skip(((page as number) - 1) * (limit)).sort({
      serial: 1
    })
    const totalPictures = await this.pictureModel.count({
      portfolioId: portfolio._id as string
    })
    const portfolioPictures = {
      _id: portfolio._id as string,
      name: portfolio.name,
      description: portfolio.description,
      year: portfolio.year,
      privacy: portfolio.privacy,
      coverImage: portfolio.coverImage,
      userSlug: portfolio.userSlug,
      pictures: pictures,
      totalPictures: totalPictures,
      slug: portfolio.slug,
      style: portfolio.style,
      color: userDetails?.color,
    };
    // console.log('pp1', portfolioPictures);
    return portfolioPictures;
  }


  async deletePortfolio(slug: string): Promise<number | null> {
    const portfolio = await this.portfolioModel.findOne({ slug: slug })
    if (!portfolio) {
      return null
    }
    await this.portfolioModel.deleteOne({ slug: slug })
    await this.pictureModel.deleteMany({ portfolioId: portfolio._id as string })
    return 1
  }

  async updatePortfolio(slug: string, userId: string, dto: UpdatePortfolioDto, token: string): Promise<Portfolio | null> {
    // 
    const portfolio = await this.portfolioModel.findOneAndUpdate({ slug: slug }, dto)

    const userDetails = await this.userModel.findOne({
      slug: portfolio?.userSlug,
    });
    const userIdFromToken = this.getUserIdFromToken(token)
    const isOriginalUser = userIdFromToken?.toString() === userDetails?._id?.toString()
    if (!isOriginalUser) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!portfolio) {
      return null
    }
    if (dto?.name?.length > 30) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    if (dto?.description?.length > 300) {
      throw new HttpException('Error Length', HttpStatus.BAD_REQUEST);
    }
    if (dto.pictures) {
      const pictures = JSON.parse(dto.pictures) as Array<IPicures>

      let count = 1;

      for (let int = 0; int < pictures.length; int++) {

        if (pictures[int]?.deleted) {
          await this.pictureModel.findOneAndDelete({ _id: pictures[int]._id })
        }
        else if (pictures[int]?.added) {
          await this.pictureModel.create({
            url: pictures[int].url,
            userId: userId,
            portfolioId: portfolio._id as string,
            serial: count++
          });
        }
        else {
          await this.pictureModel.updateOne({
            _id: pictures[int]._id
          }, {
            serial: count++
          })
        }
      }

      return portfolio;
    }
    return portfolio;
  }


  // async deleteMany(): Promise<void> {
  //   return await this.portfolioModel.deleteMany();
  // }

  // dummy() {
  //   return this.pictureModel.create({
  //     url: "FFFF",
  //     name: "jsdsjdfs",
  //     description: "ashf",
  //   });
  // }
}


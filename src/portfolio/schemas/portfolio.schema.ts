// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
// import { User } from "src/users/schemas/user.schema";

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  year: string;

  @Prop()
  privacy: string;

  @Prop({ default: 1 })
  coverImage: number;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  // userId: User;

  @Prop({ required: true })
  slug: string;

  @Prop({ default: 1 })
  style: number;

  @Prop()
  userSlug: string

}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { Portfolio } from "src/portfolio/schemas/portfolio.schema";
import { User } from "src/users/schemas/user.schema";

export type PictureDocument = Picture & Document;

@Schema()
export class Picture {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true })
  portfolioId: Portfolio;

  @Prop()
  serial: number;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);

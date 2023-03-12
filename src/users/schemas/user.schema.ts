// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  occupation: string;

  @Prop({ default: '#1f1f1f' })
  color: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 'ART PORTFOLIO' })
  mainTitle: string;

  @Prop({ slug: "title", unique: true })
  slug: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  //@Prop()
  //company: string;

  @Prop({ required: false, ref: 'Company' })
  company: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

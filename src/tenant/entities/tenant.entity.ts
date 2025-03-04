import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Tenant extends Document {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true, unique: true })
  company: string;

  @Field({ nullable: true })
  @Prop({ unique: true })
  domain?: string;

  @Field(() => [User])
  @Prop({ type: [{ type: String, ref: 'User' }] })
  users: User[];

  @Field(() => Boolean, { defaultValue: false })
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

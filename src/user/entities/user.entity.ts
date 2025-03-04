import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Tenant } from 'src/tenant/entities/tenant.entity';

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
});

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  password: string;

  @Field(() => Role)
  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Field(() => Tenant)
  @Prop({ type: String, ref: 'Tenant' })
  tenantId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'NewP@ssw0rd', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Role } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd' })
  @IsString()
  @MinLength(6)
  @MaxLength(18)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: 'tenantId123' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}

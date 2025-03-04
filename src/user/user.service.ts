import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/user.entity';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createUserDto: CreateUserDto) {
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!existingTenant) {
      throw new ConflictException('Tenant with this name already exists');
    }

    const tenantPrisma = (await this.prisma.switchTenantDatabase(
      tenantId,
    )) as PrismaService;

    const existingUser = await tenantPrisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this name already exists');
    }

    let hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData = {
      ...createUserDto,
      password: hashedPassword,
      tenantId: existingTenant.id,
      role: createUserDto.role || Role.USER,
    };

    return tenantPrisma.user.create({ data: userData });
  }

  async findAll(tenantId: string) {
    const tenantPrisma = (await this.prisma.switchTenantDatabase(
      tenantId,
    )) as PrismaService;
    return tenantPrisma.user.findMany();
  }

  async findOne(tenantId: string, id: string) {
    const tenantPrisma = await this.prisma.switchTenantDatabase(tenantId);
    const user = await tenantPrisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(tenantId: string, id: string, updateUserDto: UpdateUserDto) {
    const tenantPrisma = await this.prisma.switchTenantDatabase(tenantId);

    try {
      return await tenantPrisma.user.update({
        where: { id: id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(tenantId: string, id: string) {
    const tenantPrisma = await this.prisma.switchTenantDatabase(tenantId);

    try {
      return await tenantPrisma.user.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}

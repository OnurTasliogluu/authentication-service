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

    const userData = {
      ...createUserDto,
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import * as bcrypt from 'bcrypt';
import { uid } from 'uid';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    const { company, email, password } = createTenantDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const name = uid(16);
        // Create Tenant
        const tenant = await prisma.tenant.create({
          data: {
            name: name,
            company,
            email,
          },
        });

        const tenantPrisma = (await this.prisma.switchTenantDatabase(
          tenant.id,
        )) as PrismaService;

        // Create Admin User with tenant's email
        await tenantPrisma.user.create({
          data: {
            email: tenant.email, // Use tenant's email for admin user
            password: hashedPassword,
            tenantId: tenant.id,
            role: 'ADMIN',
          },
        });

        // Create Trial Billing
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);

        await prisma.billing.create({
          data: {
            tenantId: tenant.id,
            plan: 'TRIAL',
            status: 'TRIAL',
            amountDue: 0,
            currency: 'USD',
            cycleStart: new Date(),
            cycleEnd: trialEndDate,
          },
        });

        return tenant;
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Tenant with this name, company, or email already exists');
      }
      throw new InternalServerErrorException('An error occurred while creating the tenant');
    }
  }

  async findAll() {
    try {
      return await this.prisma.tenant.findMany({
        where: { isDeleted: false },
        include: {
          users: true,
          billing: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching tenants');
    }
  }

  async findOne(id: string) {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id },
        include: {
          billing: true,
        },
      });

      if (!tenant || tenant.isDeleted) {
        throw new NotFoundException('Tenant not found');
      }

      return tenant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while fetching the tenant');
    }
  }

  async findByEmail(email: string) {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { email },
        include: {
          users: true,
          billing: true,
        },
      });

      if (!tenant || tenant.isDeleted) {
        throw new NotFoundException('Tenant not found');
      }

      return tenant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while fetching the tenant by email');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.tenant.update({
        where: { id },
        data: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while deleting the tenant');
    }
  }

  async restore(id: string) {
    try {
      return await this.prisma.tenant.update({
        where: { id },
        data: {
          isDeleted: false,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while restoring the tenant');
    }
  }
}

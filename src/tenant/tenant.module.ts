import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService, PrismaService],
})
export class TenantModule {}

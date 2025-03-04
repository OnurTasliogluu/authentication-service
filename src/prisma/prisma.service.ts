import { Injectable, Scope, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST }) // Ensures per-request scope
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  constructor(private configService: ConfigService) {
    super({
      datasourceUrl: configService.get<string>('DATABASE_URL'), // Default DB
    });
  }

  /**
   * Switch to a tenant-specific database dynamically
   */
  async switchTenantDatabase(tenantId: string) {
    const tenantDbUrl = `${this.configService.get<string>('TENANT_DB_PREFIX')}${tenantId}`;

    return new PrismaClient({
      datasourceUrl: tenantDbUrl, // Set tenant-specific database
    });
  }
}

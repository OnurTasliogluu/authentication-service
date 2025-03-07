import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmailInAllTenants(email: string) {
    // Get all active tenants
    const tenants = await this.prisma.tenant.findMany({
      where: { isDeleted: false },
    });

    // Search tenants sequentially (stops at first match)
    for (const tenant of tenants) {
      // Get tenant-specific Prisma client
      const tenantPrisma = await this.prisma.switchTenantDatabase(tenant.id);

      // Search for unique user in this tenant's database
      const user = await tenantPrisma.user.findUnique({
        where: { email: email },
      });
      // Return immediately if found
      if (user) {
        return user;
      }
    }

    // Return null if no user found in any tenant
    return null;
  }
}

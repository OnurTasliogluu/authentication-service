import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [TenantModule, UserModule, AuthenticationModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

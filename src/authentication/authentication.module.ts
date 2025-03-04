import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available globally
      envFilePath: '.env', // Specify the path to your .env file
    }),
    JwtModule.register({
      global: true,
      secret: 'fallback-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService, CommonService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

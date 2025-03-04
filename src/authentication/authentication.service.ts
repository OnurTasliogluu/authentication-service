import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthenticationService {
  // Static SUPERADMIN configuration (should use environment variables in production)
  private readonly SUPERADMIN = {
    email: 'superadmin@system.com',
    passwordHash:
      '$2b$10$/3BJfj2THfqiTmLr/2b1vudswzSXOrKUAsOwr6LrgZtmgwHPqN5y6', // Hash for 'SUPER_SECRET_PASSWORD'
    tenantId: 'system-tenant',
    role: 'SUPERADMIN',
    id: '00000000-0000-0000-0000-000000000000',
  };

  constructor(
    private jwtService: JwtService,
    private commonService: CommonService,
  ) {}

  async validateUser(email: string, password: string) {
    // First check for SUPERADMIN
    if (email === this.SUPERADMIN.email) {
      if (!(await bcrypt.compare(password, this.SUPERADMIN.passwordHash))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.SUPERADMIN;
    }

    // Regular user flow
    const user = await this.commonService.findByEmailInAllTenants(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

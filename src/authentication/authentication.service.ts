import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';
import { JWTPayload } from './types/jwtPayload.interface';

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

  async validatePassword(password: string, user: { password: string }) {
    try {
      // Compare the provided password with the user's hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      // If the passwords don't match, throw an UnauthorizedException
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // If the passwords match, return true or proceed with your logic
      return true;
    } catch (error) {
      // Handle any errors that occur during the comparison
      console.error('Error during password comparison:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

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

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.validatePassword(password, user);

    return user;
  }

  async login(user: {
    tenantId: string;
    role: string;
    sub: string;
    email: string;
  }): Promise<{ access_token: string }> {
    const jwtPayload: JWTPayload = {
      tenantId: user.tenantId,
      role: user.role,
      sub: user.sub,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }
}

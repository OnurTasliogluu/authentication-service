import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private commonService: CommonService,
  ) {}

  async validateUser(email: string, password: string) {
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

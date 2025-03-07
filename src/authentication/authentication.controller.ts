import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { LoginPayload } from './types/login.interface';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() loginPayload: LoginPayload) {
    const user = await this.authenticationService.validateUser(
      loginPayload.data.email,
      loginPayload.data.password,
    );
    if (!user) throw new UnauthorizedException();

    return this.authenticationService.login({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    });
  }
}

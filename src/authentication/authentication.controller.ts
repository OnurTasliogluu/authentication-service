import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() request) {
    const { email, password } = request.data;
    const user = await this.authenticationService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    return this.authenticationService.login(user);
  }
}

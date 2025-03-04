import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly AuthenticationService: AuthenticationService) {}

  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const user = await this.AuthenticationService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    return this.AuthenticationService.login(user);
  }
}

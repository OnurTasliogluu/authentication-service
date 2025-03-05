import { Controller, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/middleware/guards/authentication.guard';
import { RolesGuard } from 'src/middleware/guards/role.guard';
import { Roles } from 'src/middleware/guards/role.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'createUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  create(@Payload() payload) {
    const createUserDto: CreateUserDto = payload['data'];
    return this.userService.create(payload['user'].tenantId, createUserDto);
  }

  @MessagePattern({ cmd: 'findAllUsers' })
  @Roles('ADMIN', 'SUPERADMIN')
  findAll(@Payload() payload) {
    return this.userService.findAll(payload['user'].tenantId);
  }

  @MessagePattern({ cmd: 'findOneUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  findOne(@Payload() payload) {
    return this.userService.findOne(
      payload['user'].tenantId,
      payload['data'].id,
    );
  }

  @MessagePattern({ cmd: 'updateUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  update(
    @Request() request,
    @Payload() data: { id: string; updateUserDto: UpdateUserDto },
  ) {
    const { id, updateUserDto } = data;
    return this.userService.update(request['user'].tenantId, id, updateUserDto);
  }

  @MessagePattern({ cmd: 'removeUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Request() request, @Payload() id: string) {
    return this.userService.remove(request['user'].tenantId, id);
  }
}

import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/middleware/guards/authentication.guard';
import { RolesGuard } from 'src/middleware/guards/role.guard';
import { Roles } from 'src/middleware/guards/role.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserPayload,
  FindUserPayload,
  FindAllUserPayload,
  UpdateUserPayload,
  RemoveUserPayload,
} from './types/token.interface';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'createUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  create(@Payload() payload: CreateUserPayload) {
    return this.userService.create(payload.user.tenantId, payload.data);
  }

  @MessagePattern({ cmd: 'findAllUsers' })
  @Roles('ADMIN', 'SUPERADMIN')
  findAll(@Payload() payload: FindAllUserPayload) {
    return this.userService.findAll(payload.user.tenantId);
  }

  @MessagePattern({ cmd: 'findOneUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  findOne(@Payload() payload: FindUserPayload) {
    return this.userService.findOne(
      payload['user'].tenantId,
      payload['data'].id,
    );
  }

  @MessagePattern({ cmd: 'updateUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  update(@Payload() payload: UpdateUserPayload) {
    return this.userService.update(
      payload['user'].tenantId,
      payload['data'].id,
      payload['data'].updateDataUser,
    );
  }

  @MessagePattern({ cmd: 'removeUser' })
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Payload() removeUserPayload: RemoveUserPayload) {
    return this.userService.remove(
      removeUserPayload['user'].tenantId,
      removeUserPayload['data'].id,
    );
  }
}

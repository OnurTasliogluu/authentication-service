import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/middleware/guards/authentication.guard';
import { RolesGuard } from 'src/middleware/guards/role.guard';
import { Roles } from 'src/middleware/guards/role.decorator';

@Controller('tenants')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('ADMIN', 'SUPERADMIN')
  create(@Request() request, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(request['user'].tenantId, createUserDto);
  }

  @Get()
  @Roles('ADMIN', 'SUPERADMIN')
  findAll(@Request() request) {
    return this.userService.findAll(request['user'].tenantId);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

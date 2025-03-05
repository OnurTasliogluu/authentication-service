import { Controller, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { AuthGuard } from 'src/middleware/guards/authentication.guard';
import { RolesGuard } from 'src/middleware/guards/role.guard';
import { Roles } from 'src/middleware/guards/role.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('tenant')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @MessagePattern({ cmd: 'createTenant' })
  @Roles('SUPERADMIN')
  create(@Payload() payload) {
    const createTenantDto: CreateTenantDto = payload['data'];
    return this.tenantService.create(createTenantDto);
  }

  @MessagePattern({ cmd: 'findAllTenants' })
  @Roles('SUPERADMIN')
  findAll() {
    return this.tenantService.findAll();
  }

  @MessagePattern({ cmd: 'findOneTenant' })
  @Roles('SUPERADMIN')
  findOne(@Payload() payload) {
    return this.tenantService.findOne(payload['data'].id);
  }

  @MessagePattern({ cmd: 'removeTenant' })
  @Roles('SUPERADMIN')
  remove(@Payload() payload) {
    return this.tenantService.remove(payload['data'].id);
  }
}

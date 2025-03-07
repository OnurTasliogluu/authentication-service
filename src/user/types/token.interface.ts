import { User } from 'src/common/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface CreateUserPayload {
  user: User;
  data: CreateUserDto;
}

export interface UpdateUserPayload {
  user: User;
  data: {
    updateDataUser: UpdateUserDto;
    id: string;
  };
}

export interface FindUserPayload {
  user: User;
  data: { id: string };
}

export interface RemoveUserPayload {
  user: User;
  data: { id: string };
}
export interface FindAllUserPayload {
  user: User;
}

export interface CreateUserData {
  createUserDto: CreateUserDto;
  tenantId: string;
  password: string;
  role: string;
}

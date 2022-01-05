import { Role } from './../../auth/role/role.enum';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Permission } from 'src/auth/permission/permission.enum';

export class CreateUserDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  firstName: string;

  @IsString()
  @ValidateIf((o) => o.avatar)
  avatar: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  roles: Role;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.permissions)
  permissions: Permission;
}

import { Role } from './../../auth/role/role.enum';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

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
}

import { Role } from '../../auth/role/role.enum';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class EditUserDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  firstName: string;

  @IsString()
  @ValidateIf((o) => o.avatar)
  avatar: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.email)
  email: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.password)
  password: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.roles)
  roles: Role;
}

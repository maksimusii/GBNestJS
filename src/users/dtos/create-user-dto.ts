import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  firstName: string;
}

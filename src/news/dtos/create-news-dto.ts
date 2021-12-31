import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateNewsDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  title: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.description)
  description: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  cover: string;
}

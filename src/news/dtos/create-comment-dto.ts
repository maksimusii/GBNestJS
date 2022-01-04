import { IsNotEmpty, IsString, ValidateIf, IsNumber } from 'class-validator';

export class CreateCommentsDto {
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.id)
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  message: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

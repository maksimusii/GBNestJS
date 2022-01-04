import { IsNotEmpty, IsString, ValidateIf, IsNumber } from 'class-validator';

export class EditCommentsDto {
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.id)
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  message: string;
}

import { IsNotEmpty, IsString, ValidateIf, IsNumber } from 'class-validator';

export class CreateReplayCommentsDto {
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.id)
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  message: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  author: string;
}
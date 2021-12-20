import { IsString, IsNumber, ValidateIf } from 'class-validator';

export class EditeNewsDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  author: string;

  @ValidateIf((o) => o !== undefined)
  countView: number;

  @ValidateIf((o) => o !== undefined)
  cover: string;
}

import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.author)
  author: string;

  @ValidateIf((o) => o.countView || o.countView !== null)
  @IsNotEmpty()
  countView: number;

  @ValidateIf((o) => o.cover)
  cover: string;
}

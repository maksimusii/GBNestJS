import { IsString, IsNumber, ValidateIf, IsNotEmpty } from 'class-validator';

export class EditNewsDto {
  @IsNumber()
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

  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.coutView)
  countView: number;

  @ValidateIf((o) => o.cover)
  cover: string;
}

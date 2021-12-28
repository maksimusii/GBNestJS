import { CreateReplayCommentsDto } from './edit-replay-comment-dto';
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

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.title)
  author: string;

  replayComments: CreateReplayCommentsDto[];

  avatar: string;
}

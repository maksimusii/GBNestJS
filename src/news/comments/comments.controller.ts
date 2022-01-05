import { CommentsEntity } from 'src/news/comments/comments.entity';
import { CommentsService } from './comments.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EditCommentsDto } from '../dtos/edit-comment-dto';
import { CreateCommentsDto } from '../dtos/create-comment-dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/api/:newsId')
  async create(
    @Body() comment: CreateCommentsDto,
    @Param('newsId', ParseIntPipe) newsId: number,
  ): Promise<CommentsEntity> {
    return this.commentsService.create(comment, newsId);
  }

  @Get('/api/:newsId')
  async get(
    @Param('newsId', ParseIntPipe) newsId: number,
  ): Promise<CommentsEntity[]> {
    return this.commentsService.findByNewsId(newsId);
  }

  @Delete('/api/:commentId')
  async remove(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<string> {
    const isRemoved = await this.commentsService.remove(commentId);
    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'Коментарий удален' : 'Переданный не верный id',
      },
      HttpStatus.OK,
    );
  }

  @Patch('/api/:commentId')
  async edit(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() comment: EditCommentsDto,
  ): Promise<CommentsEntity | null> {
    const _comments = this.commentsService.edit(commentId, comment);
    if (!_comments) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарий не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return _comments;
  }
}

import { CommentsService, Comment } from './comments.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/api/:idNews')
  create(
    @Param('idNews') idNews: string,
    @Body() comment: Comment,
  ): Comment | string {
    const idNewsInt = parseInt(idNews);
    return this.commentsService.create(idNewsInt, comment);
  }

  @Get('/api/:idNews')
  get(@Param('idNews') idNews: string): Comment[] | undefined {
    const idNewsInt = parseInt(idNews);
    return this.commentsService.find(idNewsInt);
  }

  @Delete('/api/:idNews/:idComment')
  remove(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
  ): Comment | undefined {
    const idNewsInt = parseInt(idNews);
    const idCommentInt = parseInt(idComment);
    return this.commentsService.remove(idNewsInt, idCommentInt);
  }

  @Patch('/api/:idNews')
  edit(
    @Param('idNews') idNews: string,
    @Body() comment: Comment,
  ): Comment | string {
    const idNewsInt = parseInt(idNews);
    return this.commentsService.edit(idNewsInt, comment);
  }
}

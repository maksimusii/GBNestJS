import { CommentsService, Comment } from './comments.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EditCommentsDto } from '../dtos/edit-comment-dto';
import { CreateCommentsDto } from '../dtos/create-comment-dto';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const PATH_NEWS = '\\comments-static\\';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/api/:idNews')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  create(
    @Param('idNews') idNews: string,
    @Body() comment: CreateCommentsDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Comment | string {
    if (avatar?.filename) {
      comment.avatar = PATH_NEWS + avatar.filename;
    }
    const idNewsInt = parseInt(idNews);
    return this.commentsService.create(idNewsInt, comment);
  }

  @Post('/api/:idNews/:idComment')
  createReplay(
    @Param('idComment') idComment: string,
    @Param('idNews') idNews: string,
    @Body() commentReplay: Comment,
  ): Comment | string {
    const idCommentInt = parseInt(idComment);
    const idNewsInt = parseInt(idNews);
    return this.commentsService.createReplay(
      idCommentInt,
      idNewsInt,
      commentReplay,
    );
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
    @Body() comment: EditCommentsDto,
  ): Comment | string {
    const idNewsInt = parseInt(idNews);
    return this.commentsService.edit(idNewsInt, comment);
  }
}

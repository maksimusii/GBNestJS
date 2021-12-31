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

  @Post('/api/:newsId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
      fileFilter: (req: Request, file, cb) => {
        const originalName = file.originalname.split('.');
        const fileExtension = originalName[originalName.length - 1];
        if (fileExtension.search(/jpe?g|png|gif/i) === -1) {
          return cb(
            new HttpException(
              'Extension of file not allowed',
              HttpStatus.NOT_ACCEPTABLE,
            ),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  async create(
    @Body() comment: CreateCommentsDto,
    @Param('newsId', ParseIntPipe) newsId: number,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<CommentsEntity> {
    if (avatar?.filename) {
      comment.avatar = PATH_NEWS + avatar.filename;
    }
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
    return this.commentsService.edit(commentId, comment);
  }

  // @Post('/api/:idNews/:idComment')
  // createReplay(
  //   @Param('idComment') idComment: string,
  //   @Param('idNews') idNews: string,
  //   @Body() commentReplay: Comment,
  // ): Comment | string {
  //   const idCommentInt = parseInt(idComment);
  //   const idNewsInt = parseInt(idNews);
  //   return this.commentsService.createReplay(
  //     idCommentInt,
  //     idNewsInt,
  //     commentReplay,
  //   );
  // }
}

import { HelperFileLoader } from '../utils/HelperFileLoader';
import { CreateNewsDto } from './dtos/create-news-dto';
import { CommentsService } from './comments/comments.service';
import { News, NewsService } from './news.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { renderNewsAll } from 'src/views/news/news-all';
import { renderTemplate } from 'src/views/template';
import { renderNews } from 'src/views/news/news';
import { EditeNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const PATH_NEWS = '\\news-static\\';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/api/:id')
  get(@Param('id') id?: string): News | News[] {
    if (id == 'all') {
      HttpStatus.OK;
      return this.newsService.getAll();
    } else {
      const idInt = parseInt(id);
      const news = this.newsService.find(idInt);
      const comments = this.commentsService.find(idInt);
      return {
        ...news,
        comments,
      };
    }
  }

  @Get('/view')
  getAllView() {
    const news = this.newsService.getAll();
    const content = renderNewsAll(news);
    return renderTemplate(content, {
      title: 'Список новостей',
      description: 'Самые крутые новости',
    });
  }
  @Get('/view/:idNews/detail')
  getNewsDetails(@Param('idNews') idNews: string) {
    const idInt = parseInt(idNews);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);
    const content = renderNews(news, comments);
    return renderTemplate(content, {
      title: 'Список новостей',
      description: 'Самые крутые новости',
    });
  }

  @Post('/api')
  @UseInterceptors(
    FileInterceptor('cover', {
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
  create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ): News {
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    return this.newsService.create(news);
  }

  @Put('/api')
  change(@Body() news: EditeNewsDto): string {
    const isChanged = this.newsService.change(news);
    if (isChanged) {
      throw new HttpException('News have been changed', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Getting mistakes id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/api/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'News have been removed' : 'Getting mistakes id';
  }
}

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
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EditeNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MailService } from '../mail/mail.service';

const PATH_NEWS = '\\news-static\\';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private mailService: MailService,
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
  @Render('news-list')
  getAllView() {
    const news = this.newsService.getAll();
    return { news, title: 'Список новостей' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('/view/:idNews/detail')
  @Render('news-detail')
  getNewsDetails(@Param('idNews') idNews: string) {
    const idInt = parseInt(idNews);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);
    return {
      news,
      comments,
    };
  }

  @Get('/view/comments/:idNews')
  @Render('comments-list')
  getComments(@Param('idNews') idNews: string) {
    const idInt = parseInt(idNews);
    const comments = this.commentsService.find(idInt);
    return { comments };
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
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    console.log(news);
    let coverPath = undefined;
    if (cover?.filename?.length > 0) coverPath = PATH_NEWS + cover.filename;

    const _news = this.newsService.create({ ...news, cover: coverPath });
    await this.mailService.sendNewNewsForAdmins(
      ['email1@yandex.ru', 'email2@yandex.ru'],
      _news,
    );

    return _news;
  }

  @Put('/api')
  async change(@Body() news: EditeNewsDto) {
    const currentNews = this.newsService.find(news.id);
    const _news = this.newsService.change(news);
    if (typeof _news !== 'string') {
      await this.mailService.sendChangeNewsForAdmins(
        ['email1@yandex.ru', 'email2@yandex.ru'],
        news,
        currentNews,
      );
      return _news;
    }
  }

  @Delete('/api/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'News have been removed' : 'Getting mistakes id';
  }
}

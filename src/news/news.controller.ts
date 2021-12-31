import { NewsEntity } from './news.entity';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { CreateNewsDto } from './dtos/create-news-dto';
import { CommentsService } from './comments/comments.service';
import { NewsService } from './news.service';
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
  ParseIntPipe,
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

  @Get('/api/all')
  async getAll(): Promise<NewsEntity[]> {
    const news = this.newsService.getAll();
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новости не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  @Get('/api/detail/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
    const news = this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость была не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
    //const comments = this.commentsService.findById(id);
  }

  @Get('/view')
  @Render('news-list')
  async getAllView() {
    const news = await this.newsService.getAll();
    return { news, title: 'Список новостей' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('/view/:idNews/detail')
  @Render('news-detail')
  async getNewsDetails(@Param('idNews', ParseIntPipe) idNews: number) {
    const news = await this.newsService.findById(idNews);
    const comments = await this.commentsService.findByNewsId(idNews);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новости не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      news,
      comments,
    };
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
  ): Promise<NewsEntity> {
    let coverPath = undefined;
    if (cover?.filename?.length > 0) coverPath = PATH_NEWS + cover.filename;

    const _news = await this.newsService.create({ ...news, cover: coverPath });
    // await this.mailService.sendNewNewsForAdmins(
    //   ['email1@yandex.ru', 'email2@yandex.ru'],
    //   _news,
    // );

    return _news;
  }

  @Put('/api')
  async change(@Body() news: EditeNewsDto): Promise<NewsEntity> {
    //const currentNews = await this.newsService.findById(news.id);
    const _news = await this.newsService.change(news);
    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новости не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (typeof _news !== 'string') {
      // await this.mailService.sendChangeNewsForAdmins(
      //   ['email1@yandex.ru', 'email2@yandex.ru'],
      //   news,
      //   currentNews,
      // );
      return _news;
    }
  }

  @Delete('/api/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const isRemoved = await this.newsService.remove(id);
    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'Новость удалена' : 'Переданный не верный id',
      },
      HttpStatus.OK,
    );
  }
}

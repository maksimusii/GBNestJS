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
} from '@nestjs/common';

@Controller('news')
export class NewsController {
  constructor(private readonly NewsService: NewsService) {}

  @Get('/:id')
  get(@Param('id') id?: string): News | News[] {
    if (id == 'all') {
      HttpStatus.OK;
      return this.NewsService.getAll();
    } else {
      const idInt = parseInt(id);
      return this.NewsService.find(idInt);
    }
  }

  @Post()
  create(@Body() news: News): News | string {
    if (news.id) {
      const isChanged = this.NewsService.change(news);
      if (isChanged) {
        throw new HttpException('News have been created', HttpStatus.OK);
      } else {
        throw new HttpException(
          'Getting mistakes id',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      return this.NewsService.create(news);
    }
  }

  @Delete('/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemoved = this.NewsService.remove(idInt);
    return isRemoved ? 'News have been removed' : 'Getting mistakes id';
  }
}

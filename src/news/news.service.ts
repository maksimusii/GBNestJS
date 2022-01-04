import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from './../users/users.service';
import { NewsEntity } from './news.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditNewsDto } from './dtos/edit-news-dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private usersService: UsersService,
  ) {}

  async create(news: CreateNewsDto): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = news.title;
    newsEntity.description = news.description;
    newsEntity.cover = news.cover;
    const _user = await this.usersService.findById(parseInt(news.userId));
    newsEntity.user = _user;
    return this.newsRepository.save(newsEntity);
  }

  async findById(id: CreateNewsDto['id']): Promise<NewsEntity> {
    return this.newsRepository.findOne(
      { id },
      { relations: ['user', 'comments', 'comments.user'] },
    );
  }

  async remove(id: CreateNewsDto['id']): Promise<NewsEntity | null> {
    const removeNews = await this.findById(id);
    if (removeNews) {
      return this.newsRepository.remove(removeNews);
    }
    return null;
  }

  async change(news: EditNewsDto): Promise<NewsEntity | null> {
    let _news = await this.findById(news.id);
    if (_news) {
      _news = {
        ..._news,
        ...news,
      };
      return this.newsRepository.save(_news);
    }
    return null;
  }

  async getAll(userId?: number): Promise<NewsEntity[]> {
    console.log(userId);
    if (userId > 0) {
      return this.newsRepository.find({
        where: { user: userId },
        relations: ['user'],
      });
    } else {
      return this.newsRepository.find({ relations: ['user'] });
    }
  }

  // checkFileExtension(filename: string) {
  //   const originalName = filename.split('.');
  //   const fileExtension = originalName[originalName.length - 1];
  //   if (fileExtension.match(/jpg/)) {
  //     return true;
  //   } else {
  //     return 'Extension of file is not image';
  //   }
  // }
}

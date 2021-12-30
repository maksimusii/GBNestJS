import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from './../users/users.service';
import { NewsEntity } from './news.entity';
import { Comment } from './comments/comments.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface News {
  id?: number;
  title: string;
  description: string;
  author?: string;
  countView?: number;
  comments?: Comment[];
  cover?: string;
}

export interface ChangeNews {
  id?: number;
  title?: string;
  description?: string;
  author: string;
  countView?: number;
  comments?: Comment[];
  cover?: string;
}

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

  async findById(id: News['id']): Promise<NewsEntity> {
    return this.newsRepository.findOne({ id }, { relations: ['user'] });
  }

  async remove(id: News['id']): Promise<NewsEntity | null> {
    const removeNews = await this.findById(id);
    if (removeNews) {
      return this.newsRepository.remove(removeNews);
    }
    return null;
  }

  async change(news: ChangeNews): Promise<NewsEntity | null> {
    const chagedNews = await this.findById(news.id);
    if (chagedNews) {
      const editableEntity = new NewsEntity();
      editableEntity.title = news.title || chagedNews.title;
      editableEntity.description = news.description || chagedNews.description;
      editableEntity.cover = news.cover || chagedNews.cover;

      return this.newsRepository.save(chagedNews);
    }
    return null;
  }

  async getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({});
  }

  checkFileExtension(filename: string) {
    const originalName = filename.split('.');
    const fileExtension = originalName[originalName.length - 1];
    if (fileExtension.match(/jpg/)) {
      return true;
    } else {
      return 'Extension of file is not image';
    }
  }
}

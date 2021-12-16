import { Comment } from './comments/comments.service';
import { Injectable } from '@nestjs/common';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countView?: number;
  comments?: Comment[];
  cover?: string;
}

export function getRendomId(min = 1, max = 9999): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
@Injectable()
export class NewsService {
  private readonly news: News[] = [
    // {
    //   id: 1,
    //   title: 'some news',
    //   description: 'news description',
    //   author: 'MaksKarpov',
    //   countView: 2,
    // },
  ];

  create(news: News): News {
    const id = getRendomId(1, 99999);
    const finallNews = {
      ...news,
      id: id,
    };
    this.news.push(finallNews);
    return finallNews;
  }

  find(id: News['id']): News | undefined {
    return this.news.find((news: News) => news.id === id);
  }

  remove(id: News['id']): boolean {
    const indexRemoveNews = this.news.findIndex((news: News) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }
    return false;
  }

  change(news: News): boolean {
    const chagedNewsId = this.news.findIndex((item) => item.id === news.id);
    if (chagedNewsId !== -1) {
      this.news[chagedNewsId].title = news.title;
      this.news[chagedNewsId].author = news.author;
      this.news[chagedNewsId].description = news.description;
      return true;
    }
    return false;
  }

  getAll(): News[] {
    return this.news;
  }
}

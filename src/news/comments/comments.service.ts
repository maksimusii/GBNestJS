import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCommentsDto } from '../dtos/create-comment-dto';
import { EditCommentsDto } from '../dtos/edit-comment-dto';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    private usersService: UsersService,
    private newsService: NewsService,
  ) {}

  async create(
    comment: CreateCommentsDto,
    newsId: number,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(newsId);
    if (_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новости не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const commentsEntity = new CommentsEntity();
    commentsEntity.message = comment.message;
    commentsEntity.news = _news;
    const _user = await this.usersService.findById(comment.userId);
    if (_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    commentsEntity.user = _user;
    return this.commentsRepository.save(commentsEntity);
  }

  async findByNewsId(newsId: number): Promise<CommentsEntity[]> {
    return this.commentsRepository.find({
      where: { news: newsId },
      relations: ['user'],
    });
  }

  async findById(commentId: number): Promise<CommentsEntity> {
    return this.commentsRepository.findOne(commentId, { relations: ['user'] });
  }

  async remove(commentId: number): Promise<CommentsEntity> {
    const _comment = await this.findById(commentId);
    if (_comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарий не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.commentsRepository.remove(_comment);
  }

  async edit(
    commentId: number,
    comment: EditCommentsDto,
  ): Promise<CommentsEntity> {
    const _comment = await this.findById(commentId);
    if (_comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарий не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    _comment.message = comment.message;
    return this.commentsRepository.save(_comment);
  }

  async removeAll(newsId: number): Promise<CommentsEntity[]> {
    const _comments = await this.findByNewsId(newsId);
    return await this.commentsRepository.remove(_comments);
  }
}

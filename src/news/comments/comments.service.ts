import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCommentsDto } from '../dtos/create-comment-dto';
import { EditCommentsDto } from '../dtos/edit-comment-dto';
import { CommentsEntity } from './comments.entity';

export type Comment = {
  id?: number;
  message: string;
  author: string;
  replayComments?: ReplayComment[];
  avatar?: string;
};

export type EditComment = {
  id?: number;
  message?: string;
  author?: string;
  avatar?: string;
};

export type ReplayComment = {
  id?: number;
  message: string;
  author: string;
};

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    private usersService: UsersService,
  ) {}

  async create(
    comment: CreateCommentsDto,
    newsId: number,
  ): Promise<CommentsEntity> {
    const commentsEntity = new CommentsEntity();
    commentsEntity.message = comment.message;
    commentsEntity.avatar = comment.avatar;
    commentsEntity.news = newsId;
    const _user = await this.usersService.create({
      firstName: comment.author,
      id: 0,
    });
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

  async remove(commentId: number): Promise<CommentsEntity | null> {
    const removedComment = await this.findById(commentId);
    if (removedComment) {
      return this.commentsRepository.remove(removedComment);
    }
    return null;
  }

  async edit(
    commentId: number,
    comment: EditCommentsDto,
  ): Promise<CommentsEntity | null> {
    let changedComment = await this.findById(commentId);
    if (changedComment) {
      changedComment = {
        ...changedComment,
        ...comment,
      };
      return this.commentsRepository.save(changedComment);
    }
    return null;
  }

  // createReplay(idComment: number, idNews: number, commentReplay: Comment) {
  //   const replayCommentId: number = this.comments[idNews].findIndex(
  //     (c: Comment) => c.id === idComment,
  //   );
  //   if (
  //     !this.comments[idNews][replayCommentId].hasOwnProperty('replayComments')
  //   ) {
  //     this.comments[idNews][replayCommentId].replayComments = [];
  //   }
  //   this.comments[idNews][replayCommentId].replayComments.push({
  //     ...commentReplay,
  //     id: 1,
  //   });
  //   return this.comments[idNews][replayCommentId];
  // }
}

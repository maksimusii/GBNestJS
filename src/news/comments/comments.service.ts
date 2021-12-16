import { Injectable } from '@nestjs/common';
import { getRendomId } from '../news.service';

export type Comment = {
  id?: number;
  message: string;
  author: string;
  replayComents?: ReplayComment[];
};

export type EditComment = {
  id?: number;
  message?: string;
  author?: string;
};

export type ReplayComment = {
  id?: number;
  message: string;
  author: string;
};

@Injectable()
export class CommentsService {
  private readonly comments = {};
  create(idNews: number, comment: Comment) {
    if (!this.comments[idNews]) {
      this.comments[idNews] = [];
    }

    this.comments[idNews].push({ ...comment, id: getRendomId() });
    return 'Comments have been created';
  }
  find(idNews: number): Comment[] | undefined {
    return this.comments[idNews] || undefined;
  }

  remove(idNews: number, idComment: number): Comment | undefined {
    console.log(this.comments[idNews]);
    if (!this.comments[idNews]) {
      return null;
    }
    const indexComment = this.comments[idNews].findIndex(
      (c: Comment) => c.id === idComment,
    );
    console.log(indexComment);
    if (indexComment === -1) {
      return null;
    }

    return this.comments[idNews].splice(indexComment, 1);
  }

  edit(idNews: number, comment: EditComment): Comment | string {
    const chagedCommentId: number = this.comments[idNews].findIndex(
      (c: Comment) => c.id === comment.id,
    );
    if (chagedCommentId !== -1) {
      this.comments[idNews][chagedCommentId] = {
        ...this.comments[idNews][chagedCommentId],
        ...comment,
      };
      return this.comments[idNews];
    }
    return 'Комментарий не найден';
  }
}

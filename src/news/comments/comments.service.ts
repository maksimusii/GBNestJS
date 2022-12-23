import { Injectable } from '@nestjs/common';
import { getRendomId } from '../news.service';

export type Comment = {
  id?: number;
  message: string;
  author: string;
};

@Injectable()
export class CommentsService {
  private readonly commments = {};
  create(idNews: number, comment: Comment) {
    if (!this.commments[idNews]) {
      this.commments[idNews] = [];
    }

    this.commments[idNews].push({ ...comment, id: getRendomId() });
    return 'Comments have been created';
  }
  find(idNews: number): Comment[] | undefined {
    return this.commments[idNews] || undefined;
  }

  remove(idNews: number, idComment: number): Comment | undefined {
    console.log(this.commments[idNews]);
    if (!this.commments[idNews]) {
      return null;
    }
    const indexComment = this.commments[idNews].findIndex(
      (c: Comment) => c.id === idComment,
    );
    console.log(indexComment);
    if (indexComment === -1) {
      return null;
    }

    return this.commments[idNews].splice(indexComment, 1);
  }
}

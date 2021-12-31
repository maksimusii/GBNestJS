import { CommentsEntity } from 'src/news/comments/comments.entity';
import { NewsEntity } from 'src/news/news.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  firstName: string;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

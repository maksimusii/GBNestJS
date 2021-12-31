import { UsersEntity } from '../../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsEntity } from '../news.entity';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column('text', { nullable: true })
  avatar: string;

  @ManyToOne(() => NewsEntity, (news) => news.comments)
  @JoinColumn({ name: 'newsId' })
  news: number;

  @ManyToOne(() => UsersEntity, (user) => user.comments)
  user: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

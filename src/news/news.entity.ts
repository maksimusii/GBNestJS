import { UsersEntity } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentsEntity } from './comments/comments.entity';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  cover: string;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity;

  // @ManyToOne(() => CategoriesEntity, (category) => category.news)
  // category: CategoriesEntity;

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

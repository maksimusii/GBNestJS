import { Permission } from './../auth/permission/permission.enum';
import { IsEnum } from 'class-validator';
import { Role } from 'src/auth/role/role.enum';
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

  @Column('text', { nullable: true })
  avatar: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  @IsEnum(Role)
  roles: Role;

  @Column('text')
  @IsEnum(Permission)
  permissions: Permission;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

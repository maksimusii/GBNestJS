import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersEntity } from './users.entity';
import { hash } from '../utils/crypto';
import { EditUserDto } from './dtos/edit-user-dto';
import { Role } from 'src/auth/role/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    if (user.avatar) {
      userEntity.avatar = user.avatar;
    }
    userEntity.email = user.email;
    userEntity.password = await hash(user.password);
    userEntity.roles = user.roles;
    return this.usersRepository.save(userEntity);
  }

  async edit(user: EditUserDto, userId: number) {
    let _user = await this.findById(userId);
    if (_user) {
      _user = new UsersEntity();
      _user.firstName = user.firstName;
      _user.avatar = user.avatar;
      _user.email = user.email;
      _user.password = await hash(user.password);
      _user.roles = user.roles || Role.User;
      _user.id = userId;
    }
    return this.usersRepository.save(_user);
  }

  async findById(id: number) {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ email });
  }
}

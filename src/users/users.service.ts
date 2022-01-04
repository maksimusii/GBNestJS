import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersEntity } from './users.entity';
import { hash } from '../utils/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto) {
    console.log(user);
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

  async findById(id: number) {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ email });
  }
}

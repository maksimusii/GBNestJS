import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersEntity } from './users.entity';

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

    return this.usersRepository.save(userEntity);
  }

  async findById(id: number) {
    return this.usersRepository.findOne(id);
  }
}

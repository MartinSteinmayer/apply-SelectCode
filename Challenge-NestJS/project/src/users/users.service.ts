import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { UsersDto } from './dto/users.dto/users.dto';

@Injectable()
export class UsersService {
  public users: UsersDto[] = [];

  create(user: UsersDto) : UsersDto {
    this.users.push(user);
    return user;
  }

  findAll(): UsersDto[] {
    return this.users;
  }

  findOne(username: string): UsersDto | undefined {
    return this.users.find(user => user.username === username);
  }
}
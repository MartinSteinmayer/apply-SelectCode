import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersDto } from './dto/users.dto/users.dto';
import { UserEntity } from './entity/user.entity';
import { ProjectsEntity } from 'src/projects/entity/projects.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDto: UsersDto): Promise<UserEntity> {
    const findUser = this.findByUsername(createUserDto.username);
    if (findUser) {
      throw new Error('User already exists');
    }
    const user = this.userRepository.create(createUserDto);
    user.projects = [];
    return this.userRepository.save(user);
  }

  findAll(): Promise<UserEntity[]> | null {
    return this.userRepository.find();
  }

  findById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteById(id: number): Promise<UserEntity | null> {
    const userToDelete = await this.findById(id);

    if (!userToDelete) {
      return null;
    }

    const deleteResult = await this.userRepository.delete(id);

    return userToDelete;
  }

  findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async deleteByUsername(username: string): Promise<UserEntity | null> {
    // Find the user by username before deleting
    const userToDelete = await this.findByUsername(username);
    return this.deleteById(userToDelete.id);
  }

  async addProject(
    userId: number,
    project: ProjectsEntity,
  ): Promise<UserEntity> {
    const actualUser = await this.findById(userId);

    //If projects from user were not initialized, initialize it
    if (!actualUser.projects) {
      actualUser.projects = [];
    }

    actualUser.projects.push(project.id);
    return this.userRepository.save(actualUser);
  }
}

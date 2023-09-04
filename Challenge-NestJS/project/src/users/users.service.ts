import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersDto } from './dto/users.dto/users.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDto: UsersDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<UserEntity[]> | null {
    return this.userRepository.find();
  }

  findById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<UserEntity | null> {
    // Find the user by username before deleting
    const userToDelete = await this.findById(id);

    if (!userToDelete) {
      return null; // User not found
    }

    // Delete the user
    const deleteResult = await this.userRepository.delete(userToDelete);

    if (deleteResult.affected === 1) {
      // If one row was affected (i.e., deleted), return the deleted user
      return userToDelete;
    } else {
      return null; // Return null if the user was not deleted (e.g., not found)
    }
  }

  findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async deleteByUsername(username: string): Promise<UserEntity | null> {
    // Find the user by username before deleting
    const userToDelete = await this.findByUsername(username);
    return this.deleteById(userToDelete.id);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm'; // Import the Repository class from TypeORM
import { getRepositoryToken } from '@nestjs/typeorm'; // Import the getRepositoryToken function
import { UserEntity } from './entity/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let userRepository: Repository<UserEntity>; // Declare a variable for your repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity),); // Inject the repository
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

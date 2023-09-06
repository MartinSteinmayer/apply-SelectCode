import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm'; // Import the Repository class from TypeORM
import { getRepositoryToken } from '@nestjs/typeorm'; // Import the getRepositoryToken function
import { UserEntity } from './entity/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>; // Declare a variable for your repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity)); // Inject the repository
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add your test cases here
});

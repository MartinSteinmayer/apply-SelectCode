import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm'; // Import the Repository class from TypeORM
import { getRepositoryToken } from '@nestjs/typeorm'; // Import the getRepositoryToken function
import { UserEntity } from '../users/entity/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>; // Declare a variable for your repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(UserEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity),); // Inject the repository
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

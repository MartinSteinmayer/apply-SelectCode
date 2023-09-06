import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm'; // Import the Repository class from TypeORM
import { getRepositoryToken } from '@nestjs/typeorm'; // Import the getRepositoryToken function
import { UserEntity } from '../users/entity/user.entity';
import { UsersDto } from 'src/users/dto/users.dto/users.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let userRepository: Repository<UserEntity>;
  let authService: AuthService;

  const mockUser: UsersDto = {
    username: 'testuser',
    password: 'testpassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockReturnValue({userID: 1, userName: 'testuser'}),
          },
        },
        UsersService,
        {
          provide: getRepositoryToken(UserEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity),); // Inject the repository
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return user data and message if authentication is successful', () => {

      const result = controller.signIn(mockUser);

      expect(result).toEqual({
        userID: 1,
        userName: 'testuser',
        msg: 'You are logged in',
      });
    });

    it('should return an error message if authentication fails', () => {

      // Mock the validateUser function of AuthService to return null (authentication failure)
      authService.validateUser = jest.fn().mockReturnValue(null);

      const result = controller.signIn(mockUser);

      expect(result).toEqual({ msg: 'Wrong username or password' });
    });

    // Add more test cases as needed
  });
});

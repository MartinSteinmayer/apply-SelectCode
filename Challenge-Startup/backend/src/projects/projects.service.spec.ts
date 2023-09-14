import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsEntity } from './entity/projects.entity';
import { UsersService } from '../users/users.service';
import { TasksEntity } from './tasks/tasks.entity';
import { UserEntity } from '../users/entity/user.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: Repository<ProjectsEntity>;
  let taskRepository: Repository<TasksEntity>;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(ProjectsEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
        {
          provide: getRepositoryToken(TasksEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
        {
          provide: getRepositoryToken(UserEntity), // Use getRepositoryToken to provide the Repository
          useClass: Repository, // Use the Repository class from TypeORM
        },
        UsersService
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<ProjectsEntity>>(getRepositoryToken(ProjectsEntity));
    taskRepository = module.get<Repository<TasksEntity>>(getRepositoryToken(TasksEntity)); 
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// used ChatGPT to help with testing
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { EventsService } from '../events/events.service';
import { TasksEntity } from './tasks/tasks.entity';
import { ProjectsEntity } from './entity/projects.entity';
import { UserEntity } from '../users/entity/user.entity';
import { ProjectsDto } from './dto/projects.dto';
import { mock } from 'node:test';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
  let projectsService: ProjectsService;
  let eventsService: EventsService;

  const mockProject : ProjectsEntity = {
    id: 1,
    name: 'Project 1',
    description: 'Description 1',
    createdDate: new Date().toDateString(),
    author: 1,
    tasks: [1],
  }

  const mockTask : TasksEntity = {
    id: 1,
    name: 'Task 1',
    description: 'Description 1',
    createdDate: new Date().toDateString(),
    project: 1,
  }

  const mockUser : UserEntity = {
    id: 1,
    username: 'User 1',
    password: 'Password 1',
    projects: [1],
  };




  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findProjectsFromUser: jest.fn().mockResolvedValueOnce([mockProject]),
            createProject: jest.fn(),
            updateProject: jest.fn(),
            deleteProject: jest.fn().mockResolvedValueOnce(mockProject),
            findTasksFromProject: jest.fn().mockResolvedValueOnce([mockTask]),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn().mockResolvedValueOnce(mockTask),
          },
        },
        {
          provide: EventsService,
          useValue: {
            emitEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(projectsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const result = await projectsController.findAll({ user: mockUser });
      expect(result).toEqual([mockProject]);
    });
  });

  

  describe('create', () => {
    it('should create a new project', async () => {
      const newProject: ProjectsDto = { name: 'New Project', description: 'New Description', createdDate: "05-09-2023"};
      const createdProject: ProjectsEntity = { id: 1, ...newProject, author: 1, tasks: [] };

      projectsService.createProject = jest.fn().mockResolvedValueOnce(createdProject);

      const result = await projectsController.create(newProject, { user: mockUser });
      expect(result).toEqual(createdProject);
    });
  });

  
  describe('update', () => {
    it('should update a project', async () => {
      const projectId = '1';
      const updatedProject: ProjectsEntity = { id: 1, name: 'Updated Project', description: 'Updated Description', createdDate: "05-09-2023", author: 1, tasks: [] };
      
      jest.spyOn(projectsService, 'updateProject').mockResolvedValue(updatedProject);

      const result = await projectsController.update(projectId, updatedProject);
      expect(result).toEqual(updatedProject);
      expect(projectsService.updateProject).toHaveBeenCalledWith(projectId, updatedProject);
    });
  });

  

  describe('delete', () => {
    it('should delete a project', async () => {
      const projectId = '1';
      jest.spyOn(projectsService, 'deleteProject').mockResolvedValue(mockProject);

      const result = await projectsController.delete(projectId);
      expect(result).toEqual(mockProject);
      expect(projectsService.deleteProject).toHaveBeenCalledWith(projectId);
    });
  });

  // Write similar tests for other controller methods
  describe('findTasksFromProject', () => {
    it('should return an array of tasks', async () => {
      jest.spyOn(projectsService, 'findTasksFromProject').mockResolvedValue([mockTask]);
      const result = await projectsController.findTasksFromProject('1');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTask: TasksEntity = { id: 1, name: 'New Task', description: 'New Description', createdDate: "05-09-2023", project: 1 };
      jest.spyOn(projectsService, 'createTask').mockResolvedValue(newTask);
      const result = await projectsController.createTask('1', newTask);
      expect(result).toEqual(newTask);
      expect(mockProject.tasks).toContain(newTask.id);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = '1';
      const updatedTask: TasksEntity = { id: 1, name: 'Updated Task', description: 'Updated Description', createdDate: "05-09-2023", project: 1 };
      jest.spyOn(projectsService, 'updateTask').mockResolvedValue(updatedTask);
      const result = await projectsController.updateTask('1', taskId, updatedTask);
      expect(result).toEqual(updatedTask);
      expect(projectsService.updateTask).toHaveBeenCalledWith('1', taskId, updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      jest.spyOn(projectsService, 'deleteTask').mockResolvedValueOnce(mockTask);
      const result = await projectsController.deleteTask('1', String(mockTask.id));
      expect(result).toEqual(mockTask);
      expect(projectsService.deleteTask).toHaveBeenCalledWith('1', String(mockTask.id));
    });
  });


});

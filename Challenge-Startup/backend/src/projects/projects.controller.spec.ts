import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  const mockProject = {
    id: 1,
    name: 'Project 1',
    description: 'Description 1',
    owner_id: '16089aee-c895-40b6-bc07-40a95727df84',
  };

  const mockTask = {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'todo',
    created_at: new Date().toDateString(),
    project_id: 1,
    updated_at: new Date().toDateString(),
  };

  const mockUser = {
    sub: '16089aee-c895-40b6-bc07-40a95727df84',
    email: 'martin.j.steinmayer@gmail.com',
  };

  const mockComment = {
    comment: 'Comment 1',
    created_at: new Date().toDateString(),
    task_id: 1,
    user_id: '16089aee-c895-40b6-bc07-40a95727df84',
  };

  beforeEach(async () => {
    const mockProjectsService = {
      createProject: jest.fn().mockImplementation((dto, userId) => {
        return Promise.resolve({
          ...dto,
          owner_id: userId,
          id: 1, // Mocked ID
          created_at: new Date(),
          updated_at: new Date(),
        });
      }),
      findAll: jest.fn().mockResolvedValue([mockProject]), // Mocked to return an empty array
      findOne: jest.fn().mockResolvedValue(mockProject), // Mocked to return a mock project
      update: jest.fn().mockResolvedValue(mockProject), // Mocked to return a mock project
      remove: jest.fn().mockResolvedValue(mockProject), // Mocked to return a mock project
      getTasks: jest.fn().mockResolvedValue([mockTask]), // Mocked to return an empty array
      createTask: jest.fn().mockResolvedValue(mockTask), // Mocked to return a mock task
      assignTask: jest.fn().mockResolvedValue(mockTask), // Mocked to return a mock task
      unassignTask: jest.fn().mockResolvedValue(mockTask), // Mocked to return a mock task
      getTask: jest.fn().mockResolvedValue(mockTask), // Mocked to return a mock task
      updateTask: jest.fn().mockResolvedValue(mockTask), // Mocked to return a mock task
      deleteTask: jest.fn().mockResolvedValue(mockTask), // Mocked to return a mock task
      getTasksFromUser: jest.fn().mockResolvedValue([mockTask]), // Mocked to return an empty array
      getTasksFromUserAndProject: jest.fn().mockResolvedValue([mockTask]), // Mocked to return an empty array
      createComment: jest.fn().mockResolvedValue(mockComment), // Mocked to return a mock task
      getCommentsFromTask: jest.fn().mockResolvedValue([mockComment]), // Mocked to return an empty array
    };

    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
      }),
    };

    const mockMailService = {
      sendEmail: jest.fn().mockResolvedValue(true), // Mocked to return true for success
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a project', async () => {
    const mockProjectDto = {
      name: 'Project 1',
      description: 'Description 1',
    };
    const result = await controller.create(mockProjectDto, { user: mockUser });
    expect(result).toEqual({
      ...mockProject,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
    });
  });

    it('should find all projects', async () => {
        const result = await controller.findAll({ user: mockUser });
        expect(result).toEqual([mockProject]);
    });

    it('should find one project', async () => {
        const result = await controller.findOne(1);
        expect(result).toEqual(mockProject);
    });

    it('should update a project', async () => {
        const mockProjectDto = {
            name: 'Project 1',
            description: 'Description 1',
        };
        const result = await controller.update(1, mockProjectDto);
        expect(result).toEqual(mockProject);
    });

    it('should delete a project', async () => {
        const result = await controller.remove(1);
        expect(result).toEqual(mockProject);
    });

    it('should get tasks from a project', async () => {
        const result = await controller.getTasksFromProject(1);
        expect(result).toEqual([mockTask]);
    });

    it('should create a task', async () => {
        const mockTaskDto = {
            title: 'Task 1',
            description: 'Description 1',
            status: 'todo',
        };
        const result = await controller.createTask(1, mockTaskDto, { user: mockUser });
        expect(result).toEqual(mockTask);
    });

    it('should update a task', async () => {
        const mockTaskDto = {
            title: 'Task 1',
            description: 'Description 1',
            status: 'todo',
        };
        const result = await controller.updateTask(1, 1, mockTaskDto, { user: mockUser });
        expect(result).toEqual(mockTask);
    });

    it('should delete a task', async () => {
        const result = await controller.deleteTask(1, 1, { user: mockUser });
        expect(result).toEqual(mockTask);
    });

    it('should assign a task', async () => {
        const result = await controller.assignTask(1, 1, { user_email: mockUser.email }, { user: mockUser});
        expect(result).toEqual(mockTask);
    });

    it('should unassign a task', async () => {
        const result = await controller.unassignTask(1, 1,{ user_email: mockUser.email }, { user: mockUser });
        expect(result).toEqual(mockTask);
    });

    it('should get a task', async () => {
        const result = await controller.getTask(1);
        expect(result).toEqual(mockTask);
    });

    it('should get tasks from a user', async () => {
        const result = await controller.getAllTasks({user: mockUser});
        expect(result).toEqual([mockTask]);
    });

    it('should get tasks from a user and a project', async () => {
        const result = await controller.getTasksFromUserAndProject(1, mockUser.email);
        expect(result).toEqual([mockTask]);
    });

    it("should add a comment to a task", async () => {
        const mockCommentDto = {
            comment: 'Comment 1',
        };
        const result = await controller.createComment(1, mockCommentDto, { user: mockUser });
        expect(result).toEqual(mockComment);
    });

    it("should get comments from a task", async () => {
        const result = await controller.getCommentsFromTask(1);
        expect(result).toEqual([mockComment]);
    });

});

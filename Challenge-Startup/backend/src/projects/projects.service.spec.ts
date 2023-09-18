import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { mock } from 'node:test';
import { Any } from 'typeorm';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockSupabaseService;
  let mockMailService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'MAIL_HOST':
          return 'smtp.mailtrap.io';
        case 'SEND_GRID_KEY':
          return 'dummy_key';
        case 'MAIL_USERNAME':
          return 'dummy_username';
        case 'MAIL_FROM':
          return 'dummy_from@example.com';
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        insert: jest.fn(),
        select: jest.fn(),
        eq: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        filter: jest.fn(),
        in: jest.fn(),
      }),
    };

    mockMailService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project', async () => {
    const dto = {
      name: 'Test Project',
      description: 'This is a test project',
    };
    const userId = 'test-user-id';

    mockSupabaseService.getClient().from().insert.mockReturnValue({
      error: null,
    });

    const result = await service.createProject(dto, userId);

    expect(result).toEqual({
      ...dto,
      owner_id: userId,
    });
    expect(mockSupabaseService.getClient).toHaveBeenCalled();
    expect(mockSupabaseService.getClient().from().insert).toHaveBeenCalledWith([
      {
        ...dto,
        owner_id: userId,
      },
    ]);
  });


  it('should assign a task and send an email', async () => {
    const projectId = 1;
    const taskId = 2;
    const assignTaskDto = { user_email: 'test@example.com' };
    const userId = 'test-user-id';

    service.getTask = jest.fn().mockReturnValue({
      id: taskId,
      project_id: projectId,
    });

    service.findOne = jest.fn().mockReturnValue({
      id: projectId,
      owner_id: userId,
    });

    // Mocking the user fetch
    const mockSelectReturn = {
        eq: jest.fn().mockReturnValue({
            data: [{
                id: userId,
            }],
            error: null,
        }),
    };

    mockSupabaseService.getClient().from().select.mockReturnValue(mockSelectReturn);

    mockSupabaseService.getClient().from().insert.mockReturnValue({
      error: null,
    });

    mockMailService.sendEmail.mockReturnValue(Promise.resolve());

    const result = await service.assignTask(
      projectId,
      taskId,
      assignTaskDto,
      userId,
    );

    expect(mockMailService.sendEmail).toHaveBeenCalledWith(
      assignTaskDto.user_email,
    );
    expect(mockSupabaseService.getClient).toHaveBeenCalled();
});


});

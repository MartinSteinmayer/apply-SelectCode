import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'MAIL_HOST':
          return 'smtp.mailtrap.io';
        case 'SEND_GRID_KEY':
          return "dummy_key";
        case 'MAIL_USERNAME':
          return 'dummy_username';
        case 'MAIL_FROM':
          return 'dummy_from@example.com';
        default:
          return null;
      }
    }),
  };

  const mockMailerService = {
    sendEmail: jest.fn().mockImplementation((options) => {
      return Promise.resolve(options);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {provide: MailService, useValue: mockMailerService},
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email', async () => {
    const result = await service.sendEmail("test@gmail.com");
    expect(result).toBeDefined();
  });

});

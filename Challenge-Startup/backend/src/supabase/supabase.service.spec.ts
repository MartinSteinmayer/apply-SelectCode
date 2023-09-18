import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';
import { ConfigService } from '@nestjs/config';

describe('SupabaseService', () => {
  let service: SupabaseService;
  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'SUPABASE_API_URL':
          return 'https://dummy.supabase.co';
        case 'SUPABASE_ANON_KEY':
          return 'dummy_anon_key';
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = await module.resolve<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a SupabaseClient instance', async () => {
    const client = await service.getClient();
    expect(client).toBeDefined();
  });
});

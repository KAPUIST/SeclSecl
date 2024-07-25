import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthService } from './auth.service';

describe('Service', () => {
  let service: AdminAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAuthService],
    }).compile();

    service = module.get<AdminAuthService>(AdminAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

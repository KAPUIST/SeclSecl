import { Test, TestingModule } from '@nestjs/testing';
import { CpService } from './cp.service';

describe('CpService', () => {
  let service: CpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CpService],
    }).compile();

    service = module.get<CpService>(CpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

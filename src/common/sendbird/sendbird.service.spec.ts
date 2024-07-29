import { Test, TestingModule } from '@nestjs/testing';
import { SendbirdService } from './sendbird.service';

describe('SendbirdService', () => {
  let service: SendbirdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendbirdService],
    }).compile();

    service = module.get<SendbirdService>(SendbirdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

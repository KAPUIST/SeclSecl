import { Test, TestingModule } from '@nestjs/testing';
import { BatchPostsService } from './batch-posts.service';

describe('BatchPostsService', () => {
  let service: BatchPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchPostsService],
    }).compile();

    service = module.get<BatchPostsService>(BatchPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

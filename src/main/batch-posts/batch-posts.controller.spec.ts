import { Test, TestingModule } from '@nestjs/testing';
import { BatchPostsController } from './batch-posts.controller';
import { BatchPostsService } from './batch-posts.service';

describe('BatchPostsController', () => {
  let controller: BatchPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchPostsController],
      providers: [BatchPostsService],
    }).compile();

    controller = module.get<BatchPostsController>(BatchPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing'
import { BatchesController } from './main-batches.controller'
import { BatchesService } from './main-batches.service'

describe('BatchesController', () => {
  let controller: BatchesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchesController],
      providers: [BatchesService],
    }).compile()

    controller = module.get<BatchesController>(BatchesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

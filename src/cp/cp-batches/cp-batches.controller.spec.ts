import { Test, TestingModule } from '@nestjs/testing'
import { BatchesController } from './cp-batches.controller'
import { BatchesService } from './cp-batches.service'

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

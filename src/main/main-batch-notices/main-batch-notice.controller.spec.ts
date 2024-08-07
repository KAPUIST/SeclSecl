import { Test, TestingModule } from '@nestjs/testing'
import { BatchNoticeController } from './main-batch-notice.controller'
import { BatchNoticeService } from './main-batch-notice.service'

describe('BatchNoticeController', () => {
  let controller: BatchNoticeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchNoticeController],
      providers: [BatchNoticeService],
    }).compile()

    controller = module.get<BatchNoticeController>(BatchNoticeController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

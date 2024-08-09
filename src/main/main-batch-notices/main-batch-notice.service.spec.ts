import { Test, TestingModule } from '@nestjs/testing'
import { BatchNoticeService } from './main-batch-notice.service'

describe('BatchNoticeService', () => {
  let service: BatchNoticeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchNoticeService],
    }).compile()

    service = module.get<BatchNoticeService>(BatchNoticeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

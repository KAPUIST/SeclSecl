import { Test, TestingModule } from '@nestjs/testing'
import { LessonReviewService } from './lesson.review.service'

describe('ReviewService', () => {
  let service: LessonReviewService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonReviewService],
    }).compile()

    service = module.get<LessonReviewService>(LessonReviewService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

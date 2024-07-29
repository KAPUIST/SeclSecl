import { Test, TestingModule } from '@nestjs/testing'
import { SendbirdController } from './sendbird.controller'

describe('SendbirdController', () => {
  let controller: SendbirdController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendbirdController],
    }).compile()

    controller = module.get<SendbirdController>(SendbirdController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

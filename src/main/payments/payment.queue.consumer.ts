import { Processor, WorkerHost } from '@nestjs/bullmq'
import { PaymentsService } from './payments.service'
import { Job } from 'bullmq'

@Processor('paymentQueue')
export class PaymentConsumer extends WorkerHost {
  constructor(private readonly paymentService: PaymentsService) {
    super()
  }
  async process(job: Job<any, any, string>): Promise<any> {
    return await this.paymentService.bullTest(job.data.userId, job.data.bodyId)
  }
}

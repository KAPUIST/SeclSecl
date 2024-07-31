import { PartialType } from '@nestjs/swagger'
import { CreateBatchNoticeDto } from './create-batch-notice.dto'

export class UpdateBatchNoticeDto extends PartialType(CreateBatchNoticeDto) {}

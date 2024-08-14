import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class FindOneBatchPostParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_POST.COMMON.BATCH_POST_ENTITY.BATCH_UID.REQUIRED })
  batchUid: string

  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_POST.COMMON.BATCH_POST_ENTITY.BATCH_UID.REQUIRED })
  postUid: string
}

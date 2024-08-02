import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class LikeBatchPostParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_POST.COMMON.BATCH_POST_ENTITY.UID.REQUIRED })
  postUid: string
}

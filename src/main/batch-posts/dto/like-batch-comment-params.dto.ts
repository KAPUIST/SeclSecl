import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class LikeBatchCommentParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_POST.COMMON.BAND_POSTS_COMMENTS_ENTITY.UID.REQUIRED })
  commentUid: string
}

import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

export class DeleteBandCommentParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_POSTS_COMMENTS_ENTITY.UID.REQUIRED })
  commentUid: string
}

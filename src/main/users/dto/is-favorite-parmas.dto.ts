import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class isFavoriteParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.USER.COMMON.USER_LESSON_BOOKMARKS.LESSON_UID })
  lessonUid: string
}

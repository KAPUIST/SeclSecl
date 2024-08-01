import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class findMyLessonDetailParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.USER.COMMON.USER_LESSON_ENTITY.BATCH_UID })
  batchUid: string
}

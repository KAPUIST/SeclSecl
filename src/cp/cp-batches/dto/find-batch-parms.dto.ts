import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class FindBatchParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH.COMMON.BATCH__ENTITY.LESSON_UID })
  lessonUid: string
}

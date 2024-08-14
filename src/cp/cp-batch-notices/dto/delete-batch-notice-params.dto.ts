import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class DeleteBatchNoticeParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.COMMON.BATCH_NOTICE_ENTITY.LESSON_UID })
  lessonUid: string

  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.COMMON.BATCH_NOTICE_ENTITY.BATCH_UID })
  batchUid: string

  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.COMMON.BATCH_NOTICE_ENTITY.NOTIFICATION_UID })
  notificationUid: string
}

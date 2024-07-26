import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

export class GetBandPostListParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_ENTITY.UID.REQUIRED })
  bandUid: string
}

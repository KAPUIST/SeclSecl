import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

export class TransferBandDTO {
  /** userUid
   * @example "20884f88-7bc9-4ea7-a704-a3400518fffa"
   */
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_ENTITY.USER_UID.REQUIRED })
  userUid: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class GetCpInfoRO {
  @ApiProperty({ description: 'uid' })
  @IsString()
  uid: string

  @ApiProperty({ description: 'name' })
  @IsString()
  name: string

  @ApiProperty({ description: 'description' })
  @IsString()
  description: string

  @ApiProperty({ description: 'phoneNumber' })
  @IsString()
  phoneNumber: string

  @ApiProperty({ description: 'address' })
  @IsString()
  address: string
}

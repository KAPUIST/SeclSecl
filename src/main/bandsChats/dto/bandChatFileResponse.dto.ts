import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BandsChatFileResponseDto {
  @ApiProperty({
    description: '파일 URL',
    example: 'https://file-ap-2.sendbird.com/2ce758ba8c4347789e51c19f6098ddd7.jpg',
  })
  @IsString()
  @IsNotEmpty()
  file_url: string

  @ApiProperty({
    description: '파일 이름',
    example: 'image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  file_name: string

  @ApiProperty({
    description: '파일 타입',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  file_type: string
}

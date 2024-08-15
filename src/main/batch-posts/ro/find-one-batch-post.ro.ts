import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class PostImage {
  @ApiProperty({ description: '수업 자료' })
  @IsString()
  postImage: string

  @ApiProperty({ description: '자료 이름' })
  @IsString()
  field: string

  @ApiProperty({ description: '자료테이블 공지 UID' })
  @IsString()
  postUid: string
}

export class FindOneBatchPostRo {
  @ApiProperty({ description: 'UID' })
  @IsString()
  uid: string

  @ApiProperty({ description: '기수 UID' })
  @IsString()
  batchUid: string

  @ApiProperty({ description: '제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '내용' })
  @IsString()
  content: string

  @ApiProperty({ description: '좋아요 수' })
  @IsNumber()
  likeCount: number

  @ApiProperty({ description: '게시글 이미지들' })
  @IsString()
  postImages: PostImage[]
}

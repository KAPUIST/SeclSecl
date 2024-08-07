import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class S3Service {
  private s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })
  private cdnDomain = 'cdn.dfgdwssegf.shop'
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ location: string; key: string; cdnUrl: string }> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    try {
      const data = await this.s3.upload(params).promise()
      const cdnUrl = `https://${this.cdnDomain}/${key}`
      return { location: data.Location, key: key, cdnUrl: cdnUrl }
    } catch (error) {
      throw new InternalServerErrorException('파일 업로드 중 오류가 발생했습니다.')
    }
  }

  async deleteFile(key: string) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    }

    try {
      await this.s3.deleteObject(params).promise()
    } catch (error) {
      throw new InternalServerErrorException('파일 삭제 중 오류가 발생했습니다.')
    }
  }
}

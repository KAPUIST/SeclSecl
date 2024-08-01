import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class S3Service {
  private s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  async uploadFile(file: Express.Multer.File, folder: string): Promise<{ location: string; key: string }> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    try {
      const command = new PutObjectCommand(params)
      await this.s3Client.send(command)
      const location = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      return { location, key }
    } catch (error) {
      throw new InternalServerErrorException('파일 업로드 중 오류가 발생했습니다.')
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
    }

    try {
      const command = new DeleteObjectCommand(params)
      await this.s3Client.send(command)
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }
}

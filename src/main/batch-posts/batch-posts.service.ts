import { Injectable } from '@nestjs/common'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'

@Injectable()
export class BatchPostsService {
  create(uid, batchId, createBatchPostDto: CreateBatchPostDto) {
    const { ...postImfo } = createBatchPostDto

    return postImfo
  }

  findAll() {
    return `This action returns all batchPosts`
  }

  findOne(id: number) {
    return `This action returns a #${id} batchPost`
  }

  update(id: number, updateBatchPostDto: UpdateBatchPostDto) {
    return `This action updates a #${id} batchPost`
  }

  remove(id: number) {
    return `This action removes a #${id} batchPost`
  }
}

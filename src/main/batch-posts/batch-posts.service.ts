import { Injectable } from '@nestjs/common'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'

@Injectable()
export class BatchPostsService {
  create(uid: string, batchUid: string, files, createBatchPostDto: CreateBatchPostDto) {
    //유저 강의를 이용해서 권한 검사
    const { ...postImfo } = createBatchPostDto

    return postImfo
  }

  findAll() {
    return
  }

  findOne(postUid: string) {
    return
  }

  update(id: number, updateBatchPostDto: UpdateBatchPostDto) {
    return
  }

  remove(id: number) {
    return
  }
}

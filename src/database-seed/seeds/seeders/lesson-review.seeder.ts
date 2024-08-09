import { DataSource, EntityManager } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { getCpUuids } from '../main-service.seeder'
import { User } from '../../../main/users/entities/user.entity'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { Batch } from '../../../common/batches/entities/batch.entity'
import { LessonReview } from '../../../main/review/entities/lesson.review.entity'
import { LessonReviewComments } from '../../../common/lessons/entities/lesson-review-comment.entity'

export default class LessonReviewSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userRepository = dataSource.getRepository(User)
    const lessonRepository = dataSource.getRepository(Lesson)
    const batchRepository = dataSource.getRepository(Batch)

    const users = await userRepository.find()
    const lessons = await lessonRepository.find()
    const batches = await batchRepository.find()
    const cps = getCpUuids()

    if (!users.length || !lessons.length || !batches.length || !cps.length) {
      throw new Error('필요한 데이터(유저, 레슨, 배치, CP)가 없습니다. 먼저 해당 데이터를 생성해주세요.')
    }

    await dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const reviews = await Promise.all(
        Array.from({ length: 50 }).map(async () => {
          const user = users[Math.floor(Math.random() * users.length)]
          const lesson = lessons[Math.floor(Math.random() * lessons.length)]
          const batch = batches[Math.floor(Math.random() * batches.length)]
          const cpUuid = cps.find((uuid) => uuid === lesson.cpUid)
          if (!cpUuid) {
            console.warn(`No matching CP UUID found for lesson with cpUid: ${lesson.cpUid}`)
            return null // 매칭되는 CP UUID가 없을 경우 건너뜀
          }

          const reviewData = await factoryManager.get(LessonReview).make()
          const review = new LessonReview()
          review.content = reviewData.content
          review.rate = reviewData.rate
          review.user = user
          review.lesson = lesson
          review.batch = batch

          await transactionalEntityManager.save(review)

          // CP가 리뷰에 대한 댓글을 작성
          if (Math.random() > 0.5) {
            const commentData = await factoryManager.get(LessonReviewComments).make()
            const comment = new LessonReviewComments()
            comment.content = commentData.content
            comment.lessonReview = review
            await transactionalEntityManager.save(comment)

            review.comment = comment
            await transactionalEntityManager.save(review)
          }

          return review
        }),
      )

      console.log(`Seeded ${reviews.length} lesson reviews with comments`)
    })
  }
}

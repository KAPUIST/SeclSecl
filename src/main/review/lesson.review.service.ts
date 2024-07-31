import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../common/lessons/entities/lessons.entity';
import { CreateReviewDto } from './dtos/create.review.dto';
import { LessonReview } from './entities/lesson.review.entity';

@Injectable()
export class LessonReviewService {
    constructor(
        @InjectRepository(LessonReview)
        private readonly lessonReviewRepository: Repository<LessonReview>,
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>
    ){
        console.log('LessonReviewService created');
    }

    //리뷰 등록
    async createReview(id:string, createReviewDto:CreateReviewDto): Promise<LessonReview> {
        const lesson = await this.lessonRepository.findOne({ where: {uid: id}})

        if(!lesson) {
            throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
        }

        const review = await this.lessonReviewRepository.create({...createReviewDto, lesson})
        return this.lessonReviewRepository.save(review)
    }
}

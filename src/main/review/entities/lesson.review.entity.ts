import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum'
import { IsNotEmpty, IsString } from 'class-validator'
import { rawListeners } from 'process'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { Rate } from '../type/lesson.review.rate'

  @Entity('lesson_reviews')
  export class LessonReview {
    @PrimaryGeneratedColumn('uuid')
    uid: string

    @Column()
    lessonUid:string

    @Column('text')
    content: string

    @IsNotEmpty({ message: '별점을 입력하지 않으셨습니다.' })
    @IsString()
    @Column({type: 'enum', enum: Rate})
    rate: Rate

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @ManyToOne (() => Lesson, (lesson) => lesson.reviews)
    lesson: Lesson

  }
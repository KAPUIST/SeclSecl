// import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum'
// import { rawListeners } from 'process'
// import {
//     Column,
//     CreateDateColumn,
//     DeleteDateColumn,
//     Entity,
//     JoinColumn,
//     ManyToOne,
//     OneToMany,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
//   } from 'typeorm'

//   @Entity('lesson_reviews')
//   export class LessonReview {
//     @PrimaryGeneratedColumn('uuid')
//     uid: string

//     @Column('lesson_uid')
//     lessonUid: string

//     @Column('text')
//     content: string

//     /**
//      * 밴드 게시판 제목
//      * @example "안녕하세요!"
//      */
//     @IsNotEmpty({ message: '별점을 입력하지 않으셨습니다.' })
//     @IsString()
//     @Column({type: 'enum', enum: Rate})
//     rate: Rate

//     /**
//      * 밴드 게시판 내용
//      * @example "잘 부탁드려요."
//      */
//     @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_POSTS_ENTITY.CONTENT.REQUIRED })
//     @IsString()
//     @Column({ type: 'text' })
//     content: string

//     @Column({ nullable: true })
//     communityImage: string

//     @Column({ default: 0 })
//     likeCount: number

//     @CreateDateColumn()
//     createdAt: Date

//     @UpdateDateColumn()
//     updatedAt: Date

//     @DeleteDateColumn()
//     deletedAt: Date

//     @OneToMany(() => BandPostComment, (bandPostComment) => bandPostComment.bandPost)
//     bandPostComments: BandPostComment[]

//     @OneToMany(() => BandLike, (bandLike) => bandLike.bandPost)
//     bandLikes: BandLike[]

//     @ManyToOne(() => Band, (band) => band.bandPosts)
//     @JoinColumn({ name: 'band_uid' })
//     band: Band

//     @ManyToOne(() => BandMember, (bandMember) => bandMember.bandPosts)
//     @JoinColumn({ name: 'band_member_uid' })
//     bandMember: BandMember
//   }

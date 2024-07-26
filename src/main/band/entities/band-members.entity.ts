import { User } from 'src/main/users/entities/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Band } from './band.entity'
import { BandPost } from './band-posts.entity'
import { BandPostComment } from './band-post-comments.entity'

@Entity('band_members')
export class BandMember {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  userUid: string

  @Column()
  bandUid: string

  @OneToMany(() => BandPost, (bandPost) => bandPost.bandMember)
  bandPosts: BandPost[]

  @OneToMany(() => BandPostComment, (bandPostComment) => bandPostComment.bandMember)
  bandPostComments: BandPostComment[]

  @ManyToOne(() => User, (user) => user.bandMembers)
  @JoinColumn({ name: 'user_uid' })
  user: User

  @ManyToOne(() => Band, (band) => band.bandMembers)
  @JoinColumn({ name: 'band_uid' })
  band: Band
}

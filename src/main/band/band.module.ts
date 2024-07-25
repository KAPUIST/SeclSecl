import { Module } from '@nestjs/common'
import { BandController } from './band.controller'
import { BandService } from './band.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Band } from './entities/band.entity'
import { BandMember } from './entities/band-members.entity'
import { BandPost } from './entities/band-posts.entity'
import { BandPostComment } from './entities/band-post-comments.entity'
import { BandLike } from './entities/band-likes.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Band, BandMember, BandPost, BandPostComment, BandLike, User])],
  controllers: [BandController],
  providers: [BandService],
})
export class BandModule {}

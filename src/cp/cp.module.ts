import { Module } from '@nestjs/common'

import { CpAuthModule } from './auth/auth.module'
import { CpLessonsModule } from './lessons/cp-lessons.module'

@Module({
  imports: [CpAuthModule, CpLessonsModule],
  controllers: [],
  providers: [],
  exports: [CpAuthModule],
})
export class CpModule {}

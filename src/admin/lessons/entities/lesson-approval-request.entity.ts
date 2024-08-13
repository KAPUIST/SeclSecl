import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApprovalType } from '../types/approval.type'

@Entity({ database: 'seclsecl_admin' })
export class LessonApprovalRequests {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  lessonId: string

  @Column({ type: 'enum', enum: ApprovalType, default: ApprovalType.PENDING })
  requestStatus: ApprovalType

  @Column()
  rejectionReason: string

  @CreateDateColumn()
  createdAt: Date
}

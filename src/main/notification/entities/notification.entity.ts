import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { RecipientType } from '../types/recipient.type'
import { RelatedEntityType } from '../types/related-entity.type'

@Entity('notifications')
@Index(['recipientUid', 'recipientType'])
@Index(['relatedEntityUid', 'relatedEntityType'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  recipientUid: string

  @Column({ type: 'enum', enum: RecipientType })
  recipientType: RecipientType

  @Column()
  notificationType: string

  @Column({ type: 'text' })
  content: string

  @Column()
  relatedEntityUid: string

  @Column({ type: 'enum', enum: RelatedEntityType })
  relatedEntityType: RelatedEntityType

  @Column()
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({ nullable: true })
  readAt: Date
}

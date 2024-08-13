import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('notifications')
@Index(['recipientUid', 'recipientType'])
@Index(['relatedEntityUid', 'relatedEntityType'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  recipientUid: string

  @Column()
  recipientType: string

  @Column()
  notificationType: string

  @Column({ type: 'text' })
  content: string

  @Column()
  relatedEntityUid: string

  @Column()
  relatedEntityType: string

  @Column()
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({ nullable: true })
  readAt: Date
}

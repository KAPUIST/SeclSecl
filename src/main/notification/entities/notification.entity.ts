import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('notifications')
@Index(['recipientId', 'recipientType'])
@Index(['relatedEntityId', 'relatedEntityType'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  recipientId: string

  @Column()
  recipientType: string

  @Column()
  notificationType: string

  @Column({ type: 'text'})
  content: string

  @Column()
  relatedEntityId: string

  @Column()
  relatedEntityType: string

  @Column()
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({nullable: true})
  readAt: Date


}

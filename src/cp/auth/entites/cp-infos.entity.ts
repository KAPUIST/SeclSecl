import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { cp } from './cp.entity'

@Entity({ name: 'cpInfos' })
export class cpInfos {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @OneToOne(() => cp, (cp) => cp.cp)
  @JoinColumn({ name: 'uid' })
  cp: cp

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false })
  dascription: string

  @Column({ type: 'varchar', nullable: false })
  phoneNumber: string

  @Column({ type: 'varchar', nullable: true })
  address: string
}

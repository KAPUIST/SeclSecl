import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Cp } from './cp.entity'

@Entity({ database: 'seclsecl_cp', name: 'cp_infos' })
export class CpInfo {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @OneToOne(() => Cp, (cp) => cp.cpInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uid' })
  cp: Cp

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: false })
  description: string

  @Column({ type: 'varchar', nullable: false })
  phoneNumber: string

  @Column({ type: 'varchar', nullable: true })
  address: string
}

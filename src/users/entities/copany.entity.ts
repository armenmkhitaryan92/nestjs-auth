import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  catchPhrase: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bs: string | null;

  @OneToOne(() => User, (user) => user.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}

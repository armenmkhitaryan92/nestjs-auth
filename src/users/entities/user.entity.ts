import { UserRole } from '../enums/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './copany.entity';
import { Address } from './address.entity';

@Entity('users')
// User Table in Database
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // firstName Column in User Table on Database
  @Column({
    length: 100,
  })
  firstName: string;

  @Column({
    length: 100,
  })
  lastName: string;

  @Column({
    unique: true,
    length: 255,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  website: string | null;

  @OneToOne(() => Address, (address) => address.user, {
    cascade: true,
    nullable: true,
  })
  address: Address | null;

  @OneToOne(() => Company, (company) => company.user, {
    cascade: true,
    nullable: true,
  })
  company: Company | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

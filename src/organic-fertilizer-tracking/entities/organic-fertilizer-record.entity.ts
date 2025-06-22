import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

@Entity()
export class OrganicFertilizerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fertilizerType: string;

  @Column('decimal', { precision: 8, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.fertilizerRecords)
  user: User;

  @ManyToOne(() => Field, field => field.fertilizerRecords)
  field: Field;

  @CreateDateColumn()
  applicationDate: Date;
} 
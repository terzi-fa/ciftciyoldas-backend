import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

@Entity()
export class FertilizerApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fertilizerType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column()
  applicationDate: Date;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.fertilizerApplications)
  user: User;

  @ManyToOne(() => Field, field => field.fertilizerApplications)
  field: Field;

  @CreateDateColumn()
  createdAt: Date;
} 
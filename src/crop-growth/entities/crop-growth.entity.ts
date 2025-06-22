import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

@Entity()
export class CropGrowth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  height: number;

  @Column('decimal', { precision: 5, scale: 2 })
  healthScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  diseaseIncidence: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  measurementDate: Date;

  @ManyToOne(() => User, user => user.cropGrowths)
  user: User;

  @ManyToOne(() => Field, field => field.cropGrowths)
  field: Field;
} 
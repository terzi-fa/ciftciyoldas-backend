import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

@Entity()
export class SoilAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 4, scale: 2 })
  ph: number;

  @Column('decimal', { precision: 5, scale: 2 })
  nitrogen: number;

  @Column('decimal', { precision: 5, scale: 2 })
  phosphorus: number;

  @Column('decimal', { precision: 5, scale: 2 })
  potassium: number;

  @Column('decimal', { precision: 4, scale: 2 })
  salinity: number;

  @Column('decimal', { precision: 5, scale: 2 })
  organicMatter: number;

  @Column({ type: 'date' })
  analysisDate: Date;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.soilAnalyses)
  user: User;

  @ManyToOne(() => Field, field => field.soilAnalyses)
  field: Field;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
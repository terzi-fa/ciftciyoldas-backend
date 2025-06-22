import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';
import { OrganicFertilizer } from '../../organic-fertilizers/entities/organic-fertilizer.entity';

@Entity('fertilizer_applications')
export class FertilizerApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  field_id: number;

  @Column()
  fertilizer_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column()
  application_date: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  weather_conditions: string;

  @Column({ nullable: true })
  effectiveness: string;

  @Column({ nullable: true })
  soil_health_impact: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Field)
  @JoinColumn({ name: 'field_id' })
  field: Field;

  @ManyToOne(() => OrganicFertilizer)
  @JoinColumn({ name: 'fertilizer_id' })
  fertilizer: OrganicFertilizer;
} 
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('organic_fertilizer_effectiveness')
export class OrganicFertilizerEffectiveness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fertilizer_id: number;

  @Column()
  crop_type_id: number;

  @Column()
  growth_stage_id: number;

  @Column()
  effectiveness: string;

  @Column()
  soil_health_impact: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column()
  application_date: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 
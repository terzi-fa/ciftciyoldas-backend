// src/organic-fertilizers/entities/fertilizer-rule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrganicFertilizer } from './organic-fertilizer.entity';

@Entity('fertilizer_rules')
export class FertilizerRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  crop_type_id: number;

  @Column({ nullable: false })
  growth_stage_id: number;

  @Column({ nullable: false })
  nutrient_type: string;

  @Column({ nullable: false })
  operator: string;

  @Column('float', { nullable: false })
  value: number;

  @Column({ nullable: false })
  fertilizer_id: number;

  @ManyToOne(() => OrganicFertilizer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fertilizer_id' })
  fertilizer: OrganicFertilizer;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  application_method: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  frequency: string;

  @Column({ nullable: true })
  recommended_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
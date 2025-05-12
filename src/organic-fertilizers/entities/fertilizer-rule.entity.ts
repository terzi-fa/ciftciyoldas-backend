import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrganicFertilizer } from './organic-fertilizer.entity';

@Entity('fertilizer_rules')
export class FertilizerRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  crop_type_id: number;

  @Column()
  growth_stage_id: number;

  @Column()
  nutrient_type: string; // Örn: 'N', 'P', 'K', 'Mg', 'B', 'Ca'

  @Column()
  operator: string; // Örn: '<', '>', '<=', '>='

  @Column('float')
  value: number;

  @Column()
  fertilizer_id: number;

  @ManyToOne(() => OrganicFertilizer)
  @JoinColumn({ name: 'fertilizer_id' })
  fertilizer: OrganicFertilizer;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  application_method: string;

  @Column({ nullable: true })
  notes: string;
}
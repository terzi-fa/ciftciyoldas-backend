// src/crop-types/entities/crop-type.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GrowthStage } from '../../growth-stages/entities/growth-stage.entity';

@Entity('crop_types')
export class CropType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;  // Ekin türünün adı

  @Column({ nullable: true })
  description: string;  // Ekin türünün açıklaması

  @Column('decimal', { precision: 4, scale: 2, nullable: true })  // nullable: true ekledik
  ideal_ph: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })  // nullable: true ekledik
  ideal_nitrogen: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })  // nullable: true ekledik
  ideal_phosphorus: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })  // nullable: true ekledik
  ideal_moisture: number;

  @Column({ nullable: true })
  image_url: string;  // Ekin türünün resmi için URL

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => GrowthStage, growthStage => growthStage.cropType)
  growthStages: GrowthStage[];
}
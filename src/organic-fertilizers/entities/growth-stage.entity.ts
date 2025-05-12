import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CropType } from '../../crop-types/entities/crop-type.entity';
import { OrganicFertilizer } from './organic-fertilizer.entity';

@Entity('growth_stages')
export class GrowthStage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;  // Dönem adı (örn: çimlenme, çiçeklenme, meyve verme)

  @Column({ nullable: true })
  description: string;  // Dönem açıklaması

  @Column({ nullable: true })
  duration_days: number;  // Dönemin ortalama süresi (gün)

  @Column({ nullable: true })
  optimal_temperature: number;  // Optimal sıcaklık (°C)

  @Column({ nullable: true })
  optimal_humidity: number;  // Optimal nem (%)

  @Column({ nullable: true })
  fertilizer_application_notes: string;  // Gübreleme notları

  @Column({ nullable: true })
  crop_type_id: number;  // İlişkili ekin türü ID'si

  @ManyToOne(() => CropType)
  @JoinColumn({ name: 'crop_type_id' })
  cropType: CropType;

  @Column({ nullable: true })
  fertilizer_id: number;  // Önerilen gübre ID'si

  @ManyToOne(() => OrganicFertilizer)
  @JoinColumn({ name: 'fertilizer_id' })
  recommendedFertilizer: OrganicFertilizer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 
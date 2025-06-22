import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

export enum Season {
  SPRING = 'spring',      // İlkbahar
  SUMMER = 'summer',      // Yaz
  AUTUMN = 'autumn',      // Sonbahar
  WINTER = 'winter'       // Kış
}

export enum RotationType {
  TRADITIONAL = 'traditional',    // Geleneksel
  ORGANIC = 'organic',           // Organik
  INTENSIVE = 'intensive',       // Yoğun
  CONSERVATION = 'conservation'  // Koruyucu
}

@Entity('crop_rotation_plans')
export class CropRotationPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Rotasyon planının adı

  @Column({ type: 'text', nullable: true })
  description: string; // Rotasyon planının açıklaması

  @Column({ type: 'int' })
  duration_years: number; // Rotasyon süresi (yıl)

  @Column({ type: 'varchar', default: RotationType.ORGANIC })
  rotation_type: string; // Rotasyon türü

  @Column({ type: 'json' })
  rotation_sequence: CropRotationYear[]; // Rotasyon sırası

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // Plan aktif mi?

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  expected_yield_increase: number; // Beklenen verim artışı (%)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_cost_savings: number; // Tahmini maliyet tasarrufu (₺)

  @Column({ type: 'text', nullable: true })
  benefits: string; // Faydalar

  @Column({ type: 'text', nullable: true })
  challenges: string; // Zorluklar

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Field, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field: Field;

  @Column()
  field_id: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}

export interface CropRotationYear {
  year: number;
  season: Season;
  crop_type_id: number;
  crop_name: string;
  crop_family: string; // Tahıl, Baklagil, Yağlı tohum vb.
  nitrogen_fixation: boolean; // Azot bağlama özelliği
  pest_repellent: boolean; // Zararlı uzaklaştırıcı
  soil_improvement: boolean; // Toprak iyileştirici
  notes?: string;
  companion_plants?: string[]; // Yan yana ekilebilecek bitkiler
} 
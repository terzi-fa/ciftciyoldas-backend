import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organic_fertilizers')
export class OrganicFertilizer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;  // Gübre adı

  @Column({ nullable: true })
  description: string;  // Gübre açıklaması (isteğe bağlı)

  @Column('decimal')
  price: number;  // Gübre fiyatı

  @Column('decimal', { nullable: true })
  nitrogen_content: number;  // Azot içeriği

  @Column('decimal', { nullable: true })
  phosphorus_content: number;  // Fosfor içeriği

  @Column('decimal', { nullable: true })
  potassium_content: number;  // Potasyum içeriği

  @Column('decimal', { nullable: true })
  suitable_ph_min: number;  // Uygun minimum pH

  @Column('decimal', { nullable: true })
  suitable_ph_max: number;  // Uygun maksimum pH

  @Column({ nullable: true })
  application_method: string;  // Uygulama yöntemi

  @Column({ nullable: true })
  dosage: string;  // Dozaj ve zamanlama bilgisi

  @Column({ nullable: true })
  storage_conditions: string;  // Depolama ve saklama koşulları

  @Column({ nullable: true })
  material_quality: string;  // Kaliteli malzeme seçimi

  @Column({ nullable: true })
  precautions: string;  // Dikkat edilmesi gerekenler

  @Column({ nullable: true })
  suitable_crops: string;  // Uygun ekin türleri (virgülle ayrılmış liste)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
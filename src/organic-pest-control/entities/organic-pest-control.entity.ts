import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Field } from '../../fields/entities/field.entity';

export enum ControlMethod {
  BIOLOGICAL = 'biological',      // Biyolojik mücadele
  CULTURAL = 'cultural',          // Kültürel mücadele
  PHYSICAL = 'physical',          // Fiziksel mücadele
  MECHANICAL = 'mechanical',      // Mekanik mücadele
  COMPANION_PLANTING = 'companion_planting' // Yan yana ekim
}

export enum PestType {
  INSECT = 'insect',              // Böcek
  DISEASE = 'disease',            // Hastalık
  WEED = 'weed',                  // Yabani ot
  NEMATODE = 'nematode',          // Nematod
  RODENT = 'rodent'               // Kemirgen
}

@Entity('organic_pest_controls')
export class OrganicPestControl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  field_id: number;

  @Column()
  pest_name: string;              // Zararlı adı

  @Column()
  pest_type: string;              // Zararlı türü

  @Column()
  control_method: string;         // Mücadele yöntemi

  @Column({ type: 'text' })
  description: string;            // Uygulama açıklaması

  @Column({ type: 'text', nullable: true })
  beneficial_organisms: string;   // Kullanılan faydalı organizmalar

  @Column({ type: 'text', nullable: true })
  companion_plants: string;       // Yan yana ekilen bitkiler

  @Column({ type: 'text', nullable: true })
  cultural_practices: string;     // Kültürel uygulamalar

  @Column('decimal', { precision: 5, scale: 2 })
  effectiveness: number;          // Etkinlik oranı (0-100)

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;                   // Maliyet

  @Column()
  application_date: Date;         // Uygulama tarihi

  @Column({ type: 'text', nullable: true })
  notes: string;                  // Notlar

  @Column({ default: false })
  is_preventive: boolean;         // Önleyici mi?

  @Column({ default: false })
  is_curative: boolean;           // Tedavi edici mi?

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Field)
  @JoinColumn({ name: 'field_id' })
  field: Field;
} 
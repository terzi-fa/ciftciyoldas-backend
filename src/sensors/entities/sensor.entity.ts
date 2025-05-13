import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CropType } from '../../crop-types/entities/crop-type.entity';
import { JoinColumn } from 'typeorm';
@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true }) // nullable: true ekledik
  sensor_id: string;  // Kullanıcının bağlanacağı sensör ID'si
  
  @Column({ default: false })
  is_connected: boolean;  // Sensörün bağlantı durumu

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ph_value: number;  // pH değeri (0-14 arası)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  nitrogen_ratio: number;  // Azot oranı (%)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  phosphorus_ratio: number;  // Fosfor oranı (%)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  potassium_ratio: number;  // Potasyum oranı (%)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    magnesium_ratio: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    boron_ratio: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    sulfur_ratio: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    zinc_ratio: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    calcium_ratio: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    iron_ratio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity_ratio: number;  // Nem oranı (%)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  soil_temperature: number;  // Toprak sıcaklığı (°C)

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  electrical_conductivity: number;  // Elektriksel iletkenlik (dS/m)

  @Column({ type: 'text', nullable: true })
  notes: string;  // Ekstra notlar (opsiyonel)

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, user => user.sensors, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => CropType)
  @JoinTable({
    name: 'sensor_crop_types',
    joinColumn: {
      name: 'sensor_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'crop_type_id',
      referencedColumnName: 'id'
    }
  })
  cropTypes: CropType[];  // Bu analiz için uygun ekin türleri

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;  // Ölçüm tarihi

  @Column({ type: 'datetime', nullable: true })
  last_reading_at: Date;  // Son ölçüm zamanı
}
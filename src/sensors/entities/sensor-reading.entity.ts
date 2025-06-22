import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Sensor } from './sensor.entity';

@Entity('sensor_readings')
export class SensorReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number; // Ölçülen değer

  @Column()
  type: string; // Ölçüm tipi (örn: 'ph', 'nitrogen', 'humidity')

  @CreateDateColumn()
  timestamp: Date; // Okumanın yapıldığı zaman

  @ManyToOne(() => Sensor, (sensor) => sensor.readings, { onDelete: 'CASCADE' })
  sensor: Sensor;
} 
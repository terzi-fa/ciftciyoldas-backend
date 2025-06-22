import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

export enum NotificationCategory {
  FERTILIZER = 'fertilizer',
  PESTICIDE = 'pesticide',
  WEATHER = 'weather',
  PEST = 'pest',
  DISEASE = 'disease',
  SYSTEM = 'system'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  type: string;

  @Column()
  category: string;

  @Column({ default: false })
  is_read: boolean;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 
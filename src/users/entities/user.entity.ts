import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Sensor } from '../../sensors/entities/sensor.entity';
import { Product } from '../../products/entities/product.entity';
import { Message } from '../../messages/entities/message.entity';
import { ForumMessage } from '../../forum-messages/entities/forum-message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Sensor, sensor => sensor.user)
  sensors: Sensor[];

  @OneToMany(() => Product, product => product.user)
  products: Product[];

  // Özel mesajlaşma için
  @OneToMany(() => Message, message => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, message => message.receiver)
  receivedMessages: Message[];

  // Forum/Topluluk mesajları için
  @OneToMany(() => ForumMessage, message => message.user)
  forumMessages: ForumMessage[];

  @CreateDateColumn({ type: 'datetime' })  // datetime tipini ekledik
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })  // datetime tipini ekledik
  updated_at: Date;
}
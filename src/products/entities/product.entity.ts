// src/products/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  certificate_id: string;

  @Column({ type: 'datetime' })
  production_date: Date;

  @Column({ type: 'datetime' })
  expiration_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  seller_location: string;

  @Column({ nullable: true })
  production_place: string;

  @Column()
  userId: number;  // Yeni eklenen alan

  @ManyToOne(() => User, (user) => user.products, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
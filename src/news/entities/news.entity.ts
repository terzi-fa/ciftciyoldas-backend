import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;  // Haber başlığı

  @Column('text')
  content: string;  // Haber içeriği

  @Column()
  url: string;  // Haberin kaynak URL'i

  @Column({ nullable: true })
  image_url: string;  // Haber görseli URL'i

  @Column({ default: true })
  is_active: boolean;  // Haberin aktif/pasif durumu

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 
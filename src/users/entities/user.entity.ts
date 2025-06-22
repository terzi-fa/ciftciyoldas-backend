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
import { Field } from '../../fields/entities/field.entity';
import { SoilAnalysis } from '../../soil-analysis/entities/soil-analysis.entity';
import { OrganicFertilizerRecord } from '../../organic-fertilizer-tracking/entities/organic-fertilizer-record.entity';
import { CropGrowth } from '../../crop-growth/entities/crop-growth.entity';
import { OrganicPestControl } from '../../organic-pest-control/entities/organic-pest-control.entity';
import { FertilizerApplication } from '../../fertilizer/entities/fertilizer-application.entity';
import { CropRotationPlan } from '../../crop-rotation/entities/crop-rotation-plan.entity';

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

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

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

  @OneToMany(() => Field, field => field.user)
  fields: Field[];

  @OneToMany(() => SoilAnalysis, soilAnalysis => soilAnalysis.user)
  soilAnalyses: SoilAnalysis[];

  @OneToMany(() => OrganicFertilizerRecord, fertilizerRecord => fertilizerRecord.user)
  fertilizerRecords: OrganicFertilizerRecord[];

  @OneToMany(() => CropGrowth, cropGrowth => cropGrowth.user)
  cropGrowths: CropGrowth[];

  @OneToMany(() => OrganicPestControl, pestControl => pestControl.user)
  organicPestControls: OrganicPestControl[];

  @OneToMany(() => FertilizerApplication, fertilizerApplication => fertilizerApplication.user)
  fertilizerApplications: FertilizerApplication[];

  @OneToMany(() => CropRotationPlan, rotationPlan => rotationPlan.user)
  cropRotationPlans: CropRotationPlan[];
}
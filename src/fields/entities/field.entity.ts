import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SoilAnalysis } from '../../soil-analysis/entities/soil-analysis.entity';
import { OrganicFertilizerRecord } from '../../organic-fertilizer-tracking/entities/organic-fertilizer-record.entity';
import { CropGrowth } from '../../crop-growth/entities/crop-growth.entity';
import { OrganicPestControl } from '../../organic-pest-control/entities/organic-pest-control.entity';
import { WeatherData } from '../../weather/weather.service';
import { FertilizerApplication } from '../../fertilizer/entities/fertilizer-application.entity';
import { CropRotationPlan } from '../../crop-rotation/entities/crop-rotation-plan.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number; // dönüm cinsinden

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  soilType: string;

  @Column({ nullable: true })
  cropType: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, user => user.fields)
  user: User;

  @OneToMany(() => SoilAnalysis, soilAnalysis => soilAnalysis.field)
  soilAnalyses: SoilAnalysis[];

  @OneToMany(() => OrganicFertilizerRecord, fertilizerRecord => fertilizerRecord.field)
  fertilizerRecords: OrganicFertilizerRecord[];

  @OneToMany(() => CropGrowth, cropGrowth => cropGrowth.field)
  cropGrowths: CropGrowth[];

  @OneToMany(() => OrganicPestControl, pestControl => pestControl.field)
  organicPestControls: OrganicPestControl[];

  @OneToMany(() => FertilizerApplication, fertilizerApplication => fertilizerApplication.field)
  fertilizerApplications: FertilizerApplication[];

  @OneToMany(() => CropRotationPlan, rotationPlan => rotationPlan.field)
  cropRotationPlans: CropRotationPlan[];

  @Column({ type: 'json', nullable: true })
  weather: WeatherData;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
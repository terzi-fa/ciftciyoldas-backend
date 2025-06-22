import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SoilAnalysis } from '../soil-analysis/entities/soil-analysis.entity';
import { CropGrowth } from '../crop-growth/entities/crop-growth.entity';
import { Field } from '../fields/entities/field.entity';
import { FertilizerApplication } from '../organic-fertilizer-tracking/entities/fertilizer-application.entity';
import { OrganicFertilizerTrackingModule } from '../organic-fertilizer-tracking/organic-fertilizer-tracking.module';
import { SoilAnalysisModule } from '../soil-analysis/soil-analysis.module';
import { CropGrowthModule } from '../crop-growth/crop-growth.module';
import { FieldsModule } from '../fields/fields.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SoilAnalysis,
      CropGrowth,
      Field,
      FertilizerApplication
    ]),
    OrganicFertilizerTrackingModule,
    SoilAnalysisModule,
    CropGrowthModule,
    FieldsModule
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {} 
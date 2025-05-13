// src/fertilizer-recommendations/fertilizer-recommendations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FertilizerRecommendationsController } from './fertilizer-recommendations.controller';
import { FertilizerRecommendationsService } from './fertilizer-recommendations.service';
import { FertilizerRule } from '../organic-fertilizers/entities/fertilizer-rule.entity';
import { OrganicFertilizer } from '../organic-fertilizers/entities/organic-fertilizer.entity';
import { SensorsModule } from '../sensors/sensors.module';
import { CropTypesModule } from '../crop-types/crop-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FertilizerRule, OrganicFertilizer]),
    SensorsModule,
    CropTypesModule,
  ],
  controllers: [FertilizerRecommendationsController],
  providers: [FertilizerRecommendationsService],
})
export class FertilizerRecommendationsModule {}
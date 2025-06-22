import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganicFertilizerTrackingService } from './organic-fertilizer-tracking.service';
import { OrganicFertilizerTrackingController } from './organic-fertilizer-tracking.controller';
import { OrganicFertilizerRecord } from './entities/organic-fertilizer-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganicFertilizerRecord])],
  controllers: [OrganicFertilizerTrackingController],
  providers: [OrganicFertilizerTrackingService],
  exports: [OrganicFertilizerTrackingService],
})
export class OrganicFertilizerTrackingModule {} 
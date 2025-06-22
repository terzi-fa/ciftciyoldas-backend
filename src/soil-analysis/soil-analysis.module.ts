import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoilAnalysisService } from './soil-analysis.service';
import { SoilAnalysisController } from './soil-analysis.controller';
import { SoilAnalysis } from './entities/soil-analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SoilAnalysis])],
  controllers: [SoilAnalysisController],
  providers: [SoilAnalysisService],
  exports: [SoilAnalysisService],
})
export class SoilAnalysisModule {} 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoilAnalysis } from '../soil-analysis/entities/soil-analysis.entity';
import { CropGrowth } from '../crop-growth/entities/crop-growth.entity';
import { FertilizerApplication } from '../fertilizer/entities/fertilizer-application.entity';
import { Field } from '../fields/entities/field.entity';

interface TrendData {
  date: Date;
  value: number;
}

export interface FieldAnalytics {
  soilTrends: {
    ph: TrendData[];
    nitrogen: TrendData[];
    phosphorus: TrendData[];
    potassium: TrendData[];
  };
  cropTrends: {
    height: TrendData[];
    healthScore: TrendData[];
    diseaseIncidence: TrendData[];
  };
  fertilizerUsage: {
    dates: Date[];
    amounts: number[];
    types: string[];
  };
  recommendations: string[];
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(SoilAnalysis)
    private soilAnalysisRepository: Repository<SoilAnalysis>,
    @InjectRepository(CropGrowth)
    private cropGrowthRepository: Repository<CropGrowth>,
    @InjectRepository(FertilizerApplication)
    private fertilizerRepository: Repository<FertilizerApplication>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async getFieldAnalytics(userId: number, fieldId: number): Promise<FieldAnalytics> {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId, user: { id: userId } },
    });

    if (!field) {
      throw new Error('Tarla bulunamadı');
    }

    const soilAnalyses = await this.soilAnalysisRepository.find({
      where: { field: { id: fieldId } },
      order: { analysisDate: 'ASC' },
    });

    const cropGrowths = await this.cropGrowthRepository.find({
      where: { field: { id: fieldId } },
      order: { measurementDate: 'ASC' },
    });

    const fertilizerApplications = await this.fertilizerRepository.find({
      where: { field: { id: fieldId } },
      order: { applicationDate: 'ASC' },
    });

    const soilTrends = {
      ph: soilAnalyses.map(analysis => ({
        date: analysis.analysisDate,
        value: analysis.ph,
      })),
      nitrogen: soilAnalyses.map(analysis => ({
        date: analysis.analysisDate,
        value: analysis.nitrogen,
      })),
      phosphorus: soilAnalyses.map(analysis => ({
        date: analysis.analysisDate,
        value: analysis.phosphorus,
      })),
      potassium: soilAnalyses.map(analysis => ({
        date: analysis.analysisDate,
        value: analysis.potassium,
      })),
    };

    const cropTrends = {
      height: cropGrowths.map(growth => ({
        date: growth.measurementDate,
        value: growth.height,
      })),
      healthScore: cropGrowths.map(growth => ({
        date: growth.measurementDate,
        value: growth.healthScore,
      })),
      diseaseIncidence: cropGrowths.map(growth => ({
        date: growth.measurementDate,
        value: growth.diseaseIncidence,
      })),
    };

    const fertilizerUsage = {
      dates: fertilizerApplications.map(app => app.applicationDate),
      amounts: fertilizerApplications.map(app => app.amount),
      types: fertilizerApplications.map(app => app.fertilizerType),
    };

    const recommendations = this.generateRecommendations(
      soilAnalyses[soilAnalyses.length - 1],
      cropGrowths[cropGrowths.length - 1],
    );

    return {
      soilTrends,
      cropTrends,
      fertilizerUsage,
      recommendations,
    };
  }

  private generateRecommendations(
    latestSoilAnalysis: SoilAnalysis,
    latestCropGrowth: CropGrowth,
  ): string[] {
    const recommendations: string[] = [];

    if (latestSoilAnalysis) {
      if (latestSoilAnalysis.ph < 6.0) {
        recommendations.push('Toprak pH değeri düşük. Kireçleme yapılması önerilir.');
      } else if (latestSoilAnalysis.ph > 7.5) {
        recommendations.push('Toprak pH değeri yüksek. Asitleştirici gübre kullanımı önerilir.');
      }

      if (latestSoilAnalysis.nitrogen < 20) {
        recommendations.push('Azot seviyesi düşük. Azotlu gübre uygulaması önerilir.');
      }

      if (latestSoilAnalysis.phosphorus < 15) {
        recommendations.push('Fosfor seviyesi düşük. Fosforlu gübre uygulaması önerilir.');
      }

      if (latestSoilAnalysis.potassium < 150) {
        recommendations.push('Potasyum seviyesi düşük. Potasyumlu gübre uygulaması önerilir.');
      }
    }

    if (latestCropGrowth) {
      if (latestCropGrowth.healthScore < 70) {
        recommendations.push('Bitki sağlığı zayıf. Hastalık kontrolü ve besleme programı gözden geçirilmeli.');
      }

      if (latestCropGrowth.diseaseIncidence > 30) {
        recommendations.push('Hastalık görülme oranı yüksek. İlaçlama programı gözden geçirilmeli.');
      }
    }

    return recommendations;
  }
} 
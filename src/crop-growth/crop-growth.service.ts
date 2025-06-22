import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropGrowth } from './entities/crop-growth.entity';
import { CreateCropGrowthDto } from './dto/create-crop-growth.dto';
import { UpdateCropGrowthDto } from './dto/update-crop-growth.dto';

export interface TrendData {
  date: Date;
  value: number;
}

export interface GrowthRateData {
  date: Date;
  rate: number;
}

export interface GrowthAnalysis {
  trends: {
    height: TrendData[];
    healthScore: TrendData[];
    diseaseIncidence: TrendData[];
  };
  growthRates: GrowthRateData[];
  recommendations: string[];
  averageGrowthRate: number;
}

@Injectable()
export class CropGrowthService {
  constructor(
    @InjectRepository(CropGrowth)
    private cropGrowthRepository: Repository<CropGrowth>,
  ) {}

  async create(createDto: CreateCropGrowthDto, userId: number): Promise<CropGrowth> {
    const cropGrowth = this.cropGrowthRepository.create({
      ...createDto,
      user: { id: userId },
      field: { id: createDto.fieldId },
    });
    return this.cropGrowthRepository.save(cropGrowth);
  }

  async findAll(userId: number): Promise<CropGrowth[]> {
    return this.cropGrowthRepository.find({
      where: { user: { id: userId } },
      relations: ['field'],
      order: { measurementDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<CropGrowth> {
    const cropGrowth = await this.cropGrowthRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['field'],
    });

    if (!cropGrowth) {
      throw new NotFoundException('Bitki büyüme kaydı bulunamadı');
    }

    return cropGrowth;
  }

  async update(id: number, updateDto: UpdateCropGrowthDto, userId: number): Promise<CropGrowth> {
    const cropGrowth = await this.findOne(id, userId);
    
    if (updateDto.fieldId) {
      cropGrowth.field = { id: updateDto.fieldId } as any;
    }

    Object.assign(cropGrowth, updateDto);
    return this.cropGrowthRepository.save(cropGrowth);
  }

  async remove(id: number, userId: number): Promise<void> {
    const cropGrowth = await this.findOne(id, userId);
    await this.cropGrowthRepository.remove(cropGrowth);
  }

  async getGrowthTrends(userId: number, fieldId: number): Promise<GrowthAnalysis> {
    const records = await this.cropGrowthRepository.find({
      where: { user: { id: userId }, field: { id: fieldId } },
      order: { measurementDate: 'ASC' },
    });

    if (records.length === 0) {
      throw new NotFoundException('Bitki büyüme kaydı bulunamadı');
    }

    const trends = {
      height: records.map(record => ({
        date: record.measurementDate,
        value: record.height,
      })),
      healthScore: records.map(record => ({
        date: record.measurementDate,
        value: record.healthScore,
      })),
      diseaseIncidence: records.map(record => ({
        date: record.measurementDate,
        value: record.diseaseIncidence,
      })),
    };

    const growthRates: GrowthRateData[] = [];
    for (let i = 1; i < records.length; i++) {
      const daysDiff = (records[i].measurementDate.getTime() - records[i - 1].measurementDate.getTime()) / (1000 * 60 * 60 * 24);
      const heightDiff = records[i].height - records[i - 1].height;
      
      const growthRate: GrowthRateData = {
        date: records[i].measurementDate,
        rate: heightDiff / daysDiff,
      };
      growthRates.push(growthRate);
    }

    const avgGrowthRate = growthRates.length > 0 
      ? growthRates.reduce((sum, rate: GrowthRateData) => sum + rate.rate, 0) / growthRates.length 
      : 0;

    const recommendations: string[] = [];
    if (avgGrowthRate < 0.5) {
      const recommendation: string = 'Bitki büyüme hızı düşük. Gübreleme ve sulama programı gözden geçirilmeli.';
      recommendations.push(recommendation);
    }

    const latestRecord = records[records.length - 1];
    if (latestRecord.healthScore < 70) {
      const recommendation: string = 'Bitki sağlığı zayıf. Hastalık kontrolü ve besleme programı gözden geçirilmeli.';
      recommendations.push(recommendation);
    }

    if (latestRecord.diseaseIncidence > 30) {
      const recommendation: string = 'Hastalık görülme oranı yüksek. İlaçlama programı gözden geçirilmeli.';
      recommendations.push(recommendation);
    }

    const analysis: GrowthAnalysis = {
      trends,
      growthRates,
      recommendations,
      averageGrowthRate: avgGrowthRate,
    };

    return analysis;
  }

  async getGrowthAnalysis(userId: number, fieldId: number): Promise<any> {
    const records = await this.cropGrowthRepository.find({
      where: { 
        user: { id: userId },
        field: { id: fieldId }
      },
      order: { measurementDate: 'ASC' },
    });

    if (records.length < 2) {
      return {
        averageGrowthRate: 0,
        healthTrend: 'stable',
        diseaseRisk: 'low',
        recommendations: ['Daha fazla ölçüm kaydı gerekiyor.'],
      };
    }

    const growthRates: { date: Date; rate: number }[] = [];
    for (let i = 1; i < records.length; i++) {
      const heightDiff = records[i].height - records[i-1].height;
      const daysDiff = (new Date(records[i].measurementDate).getTime() - 
                       new Date(records[i-1].measurementDate).getTime()) / (1000 * 60 * 60 * 24);
      
      growthRates.push({
        date: records[i].measurementDate,
        rate: heightDiff / daysDiff,
      });
    }

    const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate.rate, 0) / growthRates.length;
    const lastRecord = records[records.length - 1];
    const healthTrend = lastRecord.healthScore > records[0].healthScore ? 'improving' : 'declining';
    const diseaseRisk = lastRecord.diseaseIncidence > 0.3 ? 'high' : 'low';

    const recommendations: string[] = [];
    if (avgGrowthRate < 0.5) {
      recommendations.push('Bitki büyüme hızı düşük. Gübreleme ve sulama programı gözden geçirilmeli.');
    }
    if (lastRecord.healthScore < 0.6) {
      recommendations.push('Bitki sağlığı zayıf. Hastalık kontrolü ve besleme programı gözden geçirilmeli.');
    }
    if (lastRecord.diseaseIncidence > 0.2) {
      recommendations.push('Hastalık görülme oranı yüksek. İlaçlama programı gözden geçirilmeli.');
    }

    return {
      averageGrowthRate: avgGrowthRate,
      healthTrend,
      diseaseRisk,
      recommendations,
    };
  }
} 
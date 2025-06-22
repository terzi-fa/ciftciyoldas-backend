import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoilAnalysis } from './entities/soil-analysis.entity';
import { CreateSoilAnalysisDto } from './dto/create-soil-analysis.dto';
import { UpdateSoilAnalysisDto } from './dto/update-soil-analysis.dto';

interface Recommendation {
  type: string;
  action: string;
  amount: string;
  timing: string;
}

export interface FertilizationPlan {
  recommendations: Recommendation[];
  totalCost: number;
  expectedYield: number;
}

@Injectable()
export class SoilAnalysisService {
  constructor(
    @InjectRepository(SoilAnalysis)
    private soilAnalysisRepository: Repository<SoilAnalysis>,
  ) {}

  async create(createDto: CreateSoilAnalysisDto, userId: number): Promise<SoilAnalysis> {
    const soilAnalysis = this.soilAnalysisRepository.create({
      ...createDto,
      user: { id: userId },
      field: { id: createDto.fieldId },
    });
    return this.soilAnalysisRepository.save(soilAnalysis);
  }

  async findAll(userId: number): Promise<SoilAnalysis[]> {
    return this.soilAnalysisRepository.find({
      where: { user: { id: userId } },
      relations: ['field'],
      order: { analysisDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<SoilAnalysis> {
    const soilAnalysis = await this.soilAnalysisRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['field'],
    });

    if (!soilAnalysis) {
      throw new NotFoundException('Toprak analizi bulunamadı');
    }

    return soilAnalysis;
  }

  async update(id: number, updateDto: UpdateSoilAnalysisDto, userId: number): Promise<SoilAnalysis> {
    const soilAnalysis = await this.findOne(id, userId);
    
    if (updateDto.fieldId) {
      soilAnalysis.field = { id: updateDto.fieldId } as any;
    }

    Object.assign(soilAnalysis, updateDto);
    return this.soilAnalysisRepository.save(soilAnalysis);
  }

  async remove(id: number, userId: number): Promise<void> {
    const soilAnalysis = await this.findOne(id, userId);
    await this.soilAnalysisRepository.remove(soilAnalysis);
  }

  async getSoilAnalysis(userId: number, fieldId: number): Promise<SoilAnalysis[]> {
    return this.soilAnalysisRepository.find({
      where: { user: { id: userId }, field: { id: fieldId } },
      order: { analysisDate: 'DESC' },
    });
  }

  async getFertilizationPlan(userId: number, fieldId: number): Promise<FertilizationPlan> {
    const latestAnalysis = await this.soilAnalysisRepository.findOne({
      where: { user: { id: userId }, field: { id: fieldId } },
      order: { analysisDate: 'DESC' },
    });

    if (!latestAnalysis) {
      throw new NotFoundException('Toprak analizi bulunamadı');
    }

    const plan: FertilizationPlan = {
      recommendations: [],
      totalCost: 0,
      expectedYield: 0,
    };

    // pH önerileri
    if (latestAnalysis.ph < 6.0) {
      plan.recommendations.push({
        type: 'pH',
        action: 'Kireçleme',
        amount: '2-3 ton/da',
        timing: 'Ekim öncesi',
      });
      plan.totalCost += 500;
    } else if (latestAnalysis.ph > 7.5) {
      plan.recommendations.push({
        type: 'pH',
        action: 'Asitleştirici gübre',
        amount: '1-2 ton/da',
        timing: 'Ekim öncesi',
      });
      plan.totalCost += 400;
    }

    // Azot önerileri
    if (latestAnalysis.nitrogen < 20) {
      plan.recommendations.push({
        type: 'N',
        action: 'Azotlu gübre',
        amount: '30-40 kg/da',
        timing: 'Ekim öncesi ve sapa kalkma dönemi',
      });
      plan.totalCost += 600;
    }

    // Fosfor önerileri
    if (latestAnalysis.phosphorus < 15) {
      plan.recommendations.push({
        type: 'P',
        action: 'Fosforlu gübre',
        amount: '20-30 kg/da',
        timing: 'Ekim öncesi',
      });
      plan.totalCost += 700;
    }

    // Potasyum önerileri
    if (latestAnalysis.potassium < 150) {
      plan.recommendations.push({
        type: 'K',
        action: 'Potasyumlu gübre',
        amount: '25-35 kg/da',
        timing: 'Ekim öncesi',
      });
      plan.totalCost += 550;
    }

    // Beklenen verim hesaplama
    plan.expectedYield = this.calculateExpectedYield(latestAnalysis);

    return plan;
  }

  private calculateExpectedYield(analysis: SoilAnalysis): number {
    let baseYield = 500; // kg/da

    // pH etkisi
    if (analysis.ph >= 6.0 && analysis.ph <= 7.5) {
      baseYield *= 1.1;
    } else {
      baseYield *= 0.9;
    }

    // Besin elementleri etkisi
    if (analysis.nitrogen >= 20) baseYield *= 1.1;
    if (analysis.phosphorus >= 15) baseYield *= 1.1;
    if (analysis.potassium >= 150) baseYield *= 1.1;

    // Tuzluluk etkisi
    if (analysis.salinity > 2.0) {
      baseYield *= 0.8;
    }

    return Math.round(baseYield);
  }
} 
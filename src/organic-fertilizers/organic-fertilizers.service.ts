import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganicFertilizer } from './entities/organic-fertilizer.entity';
import { FertilizerRule } from './entities/fertilizer-rule.entity';
import { GrowthStage } from './entities/growth-stage.entity';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class OrganicFertilizersService {
  constructor(
    @InjectRepository(OrganicFertilizer)
    private organicFertilizerRepository: Repository<OrganicFertilizer>,
    @InjectRepository(FertilizerRule)
    private fertilizerRuleRepository: Repository<FertilizerRule>,
    @InjectRepository(GrowthStage)
    private growthStageRepository: Repository<GrowthStage>, // Bunu ekle
  ) {}

  // Tüm gübreleri getir
  async findAll(): Promise<OrganicFertilizer[]> {
    return this.organicFertilizerRepository.find();
  }

  // Tek bir gübreyi getir
  async findOne(id: number): Promise<OrganicFertilizer> {
    const fertilizer = await this.organicFertilizerRepository.findOne({ where: { id } });
    if (!fertilizer) {
      throw new NotFoundException(`ID ${id} olan gübre bulunamadı`);
    }
    return fertilizer;
  }

  // Kural tabanlı öneri fonksiyonu
  async getRecommendedFertilizers(
    crop_type_id: number,
    growth_stage_id: number,
    nutrients: { [key: string]: number }
  ) {
    // 1. İlgili kuralları çek
    const allRules = await this.fertilizerRuleRepository.find({
      where: { crop_type_id, growth_stage_id },
      relations: ['fertilizer'],
    });

    // 2. Besin değerlerine göre filtrele
    const matchedRules = allRules.filter(rule => {
      const value = nutrients[rule.nutrient_type];
      if (value === undefined) return false;
      switch (rule.operator) {
        case '<': return value < rule.value;
        case '>': return value > rule.value;
        case '<=': return value <= rule.value;
        case '>=': return value >= rule.value;
        case '=': return value === rule.value;
        default: return false;
      }
    });

    // 3. Sonuçları sadeleştir (gübre ve kural detayları)
    return matchedRules.map(rule => ({
      id: rule.fertilizer.id,
      name: rule.fertilizer.name,
      price: rule.fertilizer.price,
      description: rule.fertilizer.description,
      application_method: rule.fertilizer.application_method,
      dosage: rule.fertilizer.dosage,
      storage_conditions: rule.fertilizer.storage_conditions,
      material_quality: rule.fertilizer.material_quality,
      precautions: rule.fertilizer.precautions,
      // fertilizer_rules tablosundan:
      rule_dosage: rule.dosage,
      rule_notes: rule.notes,
    }));
  }
  async getGrowthStagesByCropType(cropTypeId: number) {
    // GrowthStage entity'sini import etmeyi unutma!
    return this.growthStageRepository.find({
      where: { crop_type_id: cropTypeId }
    });
  }
  

  async getFertilizerDetails(fertilizer_id: number) {
    const fertilizer = await this.organicFertilizerRepository.findOne({
      where: { id: fertilizer_id },
    });
  
    if (!fertilizer) {
      throw new NotFoundException(`ID ${fertilizer_id} olan gübre bulunamadı`);
    }
  
    const rules = await this.fertilizerRuleRepository.find({
      where: { fertilizer_id },
      select: ['dosage', 'notes'],
    });
  
    return {
      description: fertilizer.description,
      application_method: fertilizer.application_method,
      dosage: fertilizer.dosage,
      storage_conditions: fertilizer.storage_conditions,
      material_quality: fertilizer.material_quality,
      precautions: fertilizer.precautions,
      rules: rules, // [{ dosage, notes }, ...]
    };
  }
}
// src/fertilizer-recommendations/fertilizer-recommendations.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorsService } from '../sensors/sensors.service';
import { CropTypesService } from '../crop-types/crop-types.service';
import { CreateFertilizerRecommendationDto } from './dto/create-fertilizer-recommendation.dto';
import { OrganicFertilizer } from 'src/organic-fertilizers/entities/organic-fertilizer.entity';
import { FertilizerRule } from 'src/organic-fertilizers/entities/fertilizer-rule.entity';

@Injectable()
export class FertilizerRecommendationsService {
  constructor(
    @InjectRepository(FertilizerRule)
    private fertilizerRuleRepository: Repository<FertilizerRule>,
    @InjectRepository(OrganicFertilizer)
    private organicFertilizerRepository: Repository<OrganicFertilizer>,
    private sensorsService: SensorsService,
  ) {}

  async getRecommendations(dto: CreateFertilizerRecommendationDto) {
    // Sensör verilerini al
    const sensorData = await this.sensorsService.getSensorData(dto.sensor_id);

    
    // 2. İlgili kuralları çek
    const rules = await this.fertilizerRuleRepository.find({
        where: {
          crop_type_id: Number(dto.crop_type_id),
          growth_stage_id: Number(dto.growth_stage_id),
        },
        relations: ['fertilizer'],
      });
  
      // 3. Sensör verisi ile kuralları karşılaştır
      const matchedRules = rules.filter(rule => {
        const value = this.getSensorValue(sensorData, rule.nutrient_type);
        if (value === undefined || value === null) return false;
        switch (rule.operator) {
          case '<': return value < rule.value;
          case '>': return value > rule.value;
          case '<=': return value <= rule.value;
          case '>=': return value >= rule.value;
          case '=': return value === rule.value;
          default: return false;
        }
      });

      // BURAYA EKLİYORUZ - Benzersiz gübreleri oluştur
    const uniqueFertilizers = new Map<number, FertilizerRule>();
    
    for (const rule of matchedRules) {
        // Eğer bu gübre daha önce eklenmemişse ekle
        if (!uniqueFertilizers.has(rule.fertilizer.id)) {
            uniqueFertilizers.set(rule.fertilizer.id, rule);
        }
    }
      // 4. Sonuçları sadeleştir ve benzersiz gübreleri döndür
    return Array.from(uniqueFertilizers.values()).map(rule => ({
      fertilizer: rule.fertilizer,
      dosage: rule.dosage,
      nutrient_type: rule.nutrient_type,
      operator: rule.operator,
      value: rule.value,
      rule_id: rule.id,
      notes: rule.notes,
  }));

      
    }

    // Sensör verisinden ilgili besin değerini çek
  private getSensorValue(sensorData: any, nutrientType: string): number | undefined {
    switch (nutrientType) {
      case 'N': return sensorData.nitrogen_ratio;
      case 'P': return sensorData.phosphorus_ratio;
      case 'K': return sensorData.potassium_ratio;
      case 'Mg': return sensorData.magnesium_ratio;
      case 'B': return sensorData.boron_ratio;
      case 'Zn': return sensorData.zinc_ratio;
      case 'Ca': return sensorData.calcium_ratio;
      case 'Fe': return sensorData.iron_ratio;
      case 'S': return sensorData.sulfur_ratio;
      default: return undefined;
    }
  }
}
// src/fertilizer-recommendations/fertilizer-recommendations.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFertilizerRecommendationDto } from './dto/create-fertilizer-recommendation.dto';
import { FertilizerRule } from 'src/organic-fertilizers/entities/fertilizer-rule.entity';

@Injectable()
export class FertilizerRecommendationsService {
  constructor(
    @InjectRepository(FertilizerRule)
    private fertilizerRuleRepository: Repository<FertilizerRule>,
  ) {}

  async getRecommendations(dto: CreateFertilizerRecommendationDto) {
    const { cropTypeId, growthStageId, nutrients } = dto;

    console.log('Gübre önerisi servisi - Parametreler:', { cropTypeId, growthStageId, nutrients });

    const rules = await this.fertilizerRuleRepository.find({
      where: {
        crop_type_id: cropTypeId,
        growth_stage_id: growthStageId,
      },
      relations: ['fertilizer'],
    });

    const matchedRules = rules.filter(rule => {
      // Gelen sensör verilerindeki `_ratio` son ekini de hesaba kat
      const nutrientKey = rule.nutrient_type; // 'N', 'P', 'K'
      const nutrientKeyWithRatio = `${nutrientKey.toLowerCase()}_ratio`; // 'nitrogen_ratio' etc. This is likely wrong. Let's fix nutrient names.
      
      const nutrientNameMapping = {
        'N': 'nitrogen_ratio',
        'P': 'phosphorus_ratio',
        'K': 'potassium_ratio',
        'Ca': 'calcium_ratio',
        'Mg': 'magnesium_ratio',
        'S': 'sulfur_ratio',
        'Fe': 'iron_ratio',
        'Zn': 'zinc_ratio',
        'B': 'boron_ratio'
      };
      
      const value = nutrients[nutrientNameMapping[nutrientKey]] || nutrients[nutrientKey];

      if (value === undefined || value === null || value === '') return false;
      
      const numericValue = parseFloat(value);
      const ruleValue = parseFloat(rule.value.toString());

      switch (rule.operator) {
        case '<': return numericValue < ruleValue;
        case '>': return numericValue > ruleValue;
        case '<=': return numericValue <= ruleValue;
        case '>=': return numericValue >= ruleValue;
        case '=': return numericValue === ruleValue;
        default: return false;
      }
    });
    
    // Sadece kuralları ve hava durumu tavsiyesini döndür
    return { rules: matchedRules, weatherAdvice: null }; // weatherAdvice is not implemented here, returning null
  }
}
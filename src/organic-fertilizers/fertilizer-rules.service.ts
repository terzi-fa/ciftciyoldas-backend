// src/organic-fertilizers/fertilizer-rules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FertilizerRule } from './entities/fertilizer-rule.entity';
import { CreateFertilizerRuleDto } from './dto/create-fertilizer-rule.dto';
import { UpdateFertilizerRuleDto } from './dto/update-fertilizer-rule.dto.ts';

@Injectable()
export class FertilizerRulesService {
  constructor(
    @InjectRepository(FertilizerRule)
    private fertilizerRuleRepository: Repository<FertilizerRule>,
  ) {}

  async findAll(): Promise<FertilizerRule[]> {
    return this.fertilizerRuleRepository.find();
  }

  async findOne(id: number): Promise<FertilizerRule> {
    const rule = await this.fertilizerRuleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`ID ${id} olan gübre kuralı bulunamadı`);
    }
    return rule;
  }

  async createFertilizerRule(createFertilizerRuleDto: CreateFertilizerRuleDto): Promise<FertilizerRule> {
    const rule = this.fertilizerRuleRepository.create({
      fertilizer_id: createFertilizerRuleDto.fertilizerId,
      crop_type_id: createFertilizerRuleDto.cropTypeId,
      growth_stage_id: createFertilizerRuleDto.growthStageId,
      application_method: createFertilizerRuleDto.applicationMethod,
      recommended_amount: createFertilizerRuleDto.recommendedAmount,
      frequency: createFertilizerRuleDto.frequency
    });
    return this.fertilizerRuleRepository.save(rule);
  }

  async updateFertilizerRule(id: number, updateFertilizerRuleDto: UpdateFertilizerRuleDto): Promise<FertilizerRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, {
      application_method: updateFertilizerRuleDto.applicationMethod,
      recommended_amount: updateFertilizerRuleDto.recommendedAmount,
      frequency: updateFertilizerRuleDto.frequency
    });
    return this.fertilizerRuleRepository.save(rule);
  }

  async remove(id: number): Promise<void> {
    const rule = await this.findOne(id);
    await this.fertilizerRuleRepository.remove(rule);
  }

  async getFertilizerRecommendations(
    cropTypeId: number,
    growthStageId: number,
    nutrients: { [key: string]: string }
  ): Promise<FertilizerRule[]> {
    console.log('Gübre önerisi servisi - Parametreler:', { cropTypeId, growthStageId, nutrients });
    
    const rules = await this.fertilizerRuleRepository.find({
      where: {
        crop_type_id: cropTypeId,
        growth_stage_id: growthStageId,
      },
      relations: ['fertilizer'],
    });
    
    console.log('Bulunan kurallar:', rules);
    
    const matchedRules = rules.filter(rule => {
      const value = nutrients[rule.nutrient_type];
      if (value === undefined || value === null) return false;
      
      const numericValue = parseFloat(value);
      const ruleValue = parseFloat(rule.value.toString());
      
      console.log('Kural kontrolü:', {
        nutrientType: rule.nutrient_type,
        value: numericValue,
        ruleValue: ruleValue,
        operator: rule.operator
      });
      
      switch (rule.operator) {
        case '<': return numericValue < ruleValue;
        case '>': return numericValue > ruleValue;
        case '<=': return numericValue <= ruleValue;
        case '>=': return numericValue >= ruleValue;
        case '=': return numericValue === ruleValue;
        default: return false;
      }
    });
    
    console.log('Eşleşen kurallar:', matchedRules);
    return matchedRules;
  }
}
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
    nutrientType: string,
    value: number
  ): Promise<FertilizerRule[]> {
    return this.fertilizerRuleRepository.find({
      where: {
        crop_type_id: cropTypeId,
        growth_stage_id: growthStageId,
        nutrient_type: nutrientType,
        value: value
      }
    });
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FertilizerRule } from './entities/fertilizer-rule.entity';
import { FertilizerRecommendationDto } from './dto/fertilizer-recommendation.dto';

@Injectable()
export class FertilizerRulesService {
  constructor(
    @InjectRepository(FertilizerRule)
    private fertilizerRuleRepository: Repository<FertilizerRule>,
  ) {}

  async getFertilizerRecommendations(
    crop_type_id: number,
    growth_stage_id: number,
    nutrient_type: string,
    value: number
  ) {
    // Operatöre göre dinamik sorgu
    return this.fertilizerRuleRepository
      .createQueryBuilder('rule')
      .where('rule.crop_type_id = :crop_type_id', { crop_type_id })
      .andWhere('rule.growth_stage_id = :growth_stage_id', { growth_stage_id })
      .andWhere('rule.nutrient_type = :nutrient_type', { nutrient_type })
      .andWhere(`:value ${this.getSQLOperator('rule.operator')} rule.value`, { value })
      .leftJoinAndSelect('rule.fertilizer', 'fertilizer')
      .getMany();
  }
  // src/organic-fertilizers/fertilizer-rules.service.ts
  async getRecommendedFertilizers(dto: FertilizerRecommendationDto) {
    const { crop_type_id, growth_stage_id, nutrients } = dto;

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

  // 3. Gübrelerin kısa bilgisini hazırla
  return matchedRules.map(rule => ({
    id: rule.fertilizer.id,
    name: rule.fertilizer.name,
    price: rule.fertilizer.price,
    description: rule.fertilizer.description
  }));
}

  // Operatör stringini SQL'e çevir
  private getSQLOperator(operator: string) {
    if (['<', '>', '<=', '>=', '='].includes(operator)) return operator;
    return '=';
  }

  async createFertilizerRule(data: Partial<FertilizerRule>) {
    const rule = this.fertilizerRuleRepository.create(data);
    return this.fertilizerRuleRepository.save(rule);
  }

  async updateFertilizerRule(id: number, data: Partial<FertilizerRule>) {
    await this.fertilizerRuleRepository.update(id, data);
    return this.fertilizerRuleRepository.findOne({ where: { id } });
  }

  async deleteFertilizerRule(id: number) {
    const rule = await this.fertilizerRuleRepository.findOne({ where: { id } });
    if (rule) {
      await this.fertilizerRuleRepository.remove(rule);
    }
    return rule;
  }
}
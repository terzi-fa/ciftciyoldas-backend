// src/organic-fertilizers/fertilizer-rules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FertilizerRule } from './entities/fertilizer-rule.entity';
import { CreateFertilizerRuleDto } from './dto/create-fertilizer-rule.dto';
import { UpdateFertilizerRuleDto } from './dto/update-fertilizer-rule.dto.ts';
import { OrganicFertilizerEffectiveness } from './entities/organic-fertilizer-effectiveness.entity';
import { WeatherService } from '../weather/weather.service';
//Genellikle admin panelinde, bir yönetici yeni bir gübre kuralı ekler, mevcut kuralı günceller, siler veya belirli bir besin değeriyle kural eşleşmesi yapmak isterse bu servis devreye girer.
@Injectable()
export class FertilizerRulesService {
  constructor(
    @InjectRepository(FertilizerRule)
    private fertilizerRuleRepository: Repository<FertilizerRule>,
    @InjectRepository(OrganicFertilizerEffectiveness)
    private effectivenessRepository: Repository<OrganicFertilizerEffectiveness>,
    private weatherService: WeatherService,
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
    nutrients: { [key: string]: string },
    latitude?: number,
    longitude?: number
  ): Promise<{ rules: FertilizerRule[], weatherAdvice?: string }> {
    console.log('Gübre önerisi servisi - Parametreler:', { cropTypeId, growthStageId, nutrients });
    
    let weatherAdvice: string | undefined = undefined;
    if (latitude !== undefined && longitude !== undefined) {
      const weather = await this.weatherService.getWeatherData(latitude, longitude);
      const condition = this.weatherService.getWeatherConditions(weather);
      if (condition === 'yağmurlu') {
        weatherAdvice = 'Yağmurlu havada gübre uygulaması önerilmez. Gübrelemeden sonra yağış, gübrenin yıkanmasına ve etkinliğinin azalmasına neden olabilir. Hava açılana kadar bekleyin.';
      } else if (condition === 'karlı') {
        weatherAdvice = 'Karlı havada gübre uygulaması önerilmez. Toprak donmuşsa gübre etkinliği azalır.';
      } else if (condition === 'çok sıcak') {
        weatherAdvice = 'Çok sıcak havalarda gübre uygulaması bitkide yanıklara yol açabilir. Sabah erken saatler veya akşam serinliğinde uygulama yapın.';
      }
    }
    
    const rules = await this.fertilizerRuleRepository.find({
      where: {
        crop_type_id: cropTypeId,
        growth_stage_id: growthStageId,
      },
      relations: ['fertilizer'],
    });
    
    const matchedRules = rules.filter(rule => {
      // Gelen sensör verilerindeki `_ratio` son ekini de hesaba kat
      const value = nutrients[rule.nutrient_type] || nutrients[`${rule.nutrient_type}_ratio`];

      if (value === undefined || value === null) return false;
      
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
    
    return { rules: matchedRules, weatherAdvice };
  }

  async analyzeOrganicFertilizerEffectiveness(
    fertilizerId: number,
    cropTypeId: number,
    growthStageId: number
  ) {
    const effectivenessRecords = await this.effectivenessRepository.find({
      where: {
        fertilizer_id: fertilizerId,
        crop_type_id: cropTypeId,
        growth_stage_id: growthStageId,
      },
      order: { application_date: 'DESC' },
    });

    if (effectivenessRecords.length === 0) {
      return null;
    }

    const analysis = {
      averageEffectiveness: 0,
      soilHealthImpact: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
      costEffectiveness: 0,
      recommendations: [] as string[],
    };

    // Etkinlik analizi
    const effectivenessSum = effectivenessRecords.reduce((sum, record) => {
      const effectivenessValue = this.getEffectivenessValue(record.effectiveness);
      return sum + effectivenessValue;
    }, 0);
    analysis.averageEffectiveness = effectivenessSum / effectivenessRecords.length;

    // Toprak sağlığı etkisi analizi
    effectivenessRecords.forEach(record => {
      analysis.soilHealthImpact[record.soil_health_impact]++;
    });

    // Maliyet-etkinlik analizi
    const totalCost = effectivenessRecords.reduce((sum, record) => sum + record.cost, 0);
    const totalEffectiveness = effectivenessRecords.reduce((sum, record) => 
      sum + this.getEffectivenessValue(record.effectiveness), 0);
    analysis.costEffectiveness = totalEffectiveness / totalCost;

    // Öneriler oluştur
    if (analysis.averageEffectiveness < 0.6) {
      analysis.recommendations.push('Gübre etkinliği düşük. Uygulama yöntemi veya dozaj gözden geçirilmeli.');
    }

    if (analysis.soilHealthImpact.negative > analysis.soilHealthImpact.positive) {
      analysis.recommendations.push('Toprak sağlığı üzerinde olumsuz etkiler gözlemleniyor. Alternatif organik gübreler değerlendirilmeli.');
    }

    if (analysis.costEffectiveness < 0.5) {
      analysis.recommendations.push('Maliyet-etkinlik oranı düşük. Kompost veya yeşil gübre gibi alternatifler değerlendirilmeli.');
    }

    return analysis;
  }

  private getEffectivenessValue(effectiveness: string): number {
    switch (effectiveness) {
      case 'yüksek': return 1;
      case 'orta': return 0.7;
      case 'düşük': return 0.4;
      default: return 0;
    }
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropRotationPlan, RotationType, CropRotationYear } from './entities/crop-rotation-plan.entity';
import { CreateCropRotationPlanDto, CropRotationYearDto } from './dto/create-crop-rotation-plan.dto';

@Injectable()
export class CropRotationService {
  constructor(
    @InjectRepository(CropRotationPlan)
    private cropRotationRepository: Repository<CropRotationPlan>,
  ) {}

  async create(createDto: CreateCropRotationPlanDto, userId: number): Promise<CropRotationPlan> {
    // DTO'dan gelen verileri entity formatına çevir
    const rotationSequence: CropRotationYear[] = createDto.rotation_sequence.map(dto => ({
      year: dto.year,
      season: dto.season as any, // Season enum'a cast et
      crop_type_id: dto.crop_type_id,
      crop_name: dto.crop_name,
      crop_family: dto.crop_family,
      nitrogen_fixation: dto.nitrogen_fixation,
      pest_repellent: dto.pest_repellent,
      soil_improvement: dto.soil_improvement,
      notes: dto.notes,
      companion_plants: dto.companion_plants
    }));

    const rotationPlan = this.cropRotationRepository.create({
      name: createDto.name,
      description: createDto.description,
      duration_years: createDto.duration_years,
      rotation_type: createDto.rotation_type,
      rotation_sequence: rotationSequence,
      is_active: createDto.is_active ?? true,
      expected_yield_increase: createDto.expected_yield_increase,
      estimated_cost_savings: createDto.estimated_cost_savings,
      benefits: createDto.benefits,
      challenges: createDto.challenges,
      user_id: userId,
      field_id: createDto.field_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.cropRotationRepository.save(rotationPlan);
  }

  async findAll(userId: number): Promise<CropRotationPlan[]> {
    return this.cropRotationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<CropRotationPlan> {
    const rotationPlan = await this.cropRotationRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!rotationPlan) {
      throw new NotFoundException('Ekin rotasyonu planı bulunamadı');
    }

    return rotationPlan;
  }

  async getRotationRecommendations(fieldId: number, soilType: string): Promise<any> {
    // Ekin rotasyonu önerileri
    const recommendations = {
      'killi': {
        name: 'Killi Toprak Rotasyonu',
        description: 'Killi topraklar için uygun ekin sıralaması',
        sequence: [
          { year: 1, season: 'spring', crop: 'Buğday', family: 'Tahıl', benefits: ['Toprak yapısını iyileştirir'] },
          { year: 1, season: 'autumn', crop: 'Arpa', family: 'Tahıl', benefits: ['Erozyonu önler'] },
          { year: 2, season: 'spring', crop: 'Fasulye', family: 'Baklagil', benefits: ['Azot bağlar', 'Toprak verimliliğini artırır'] },
          { year: 2, season: 'autumn', crop: 'Mercimek', family: 'Baklagil', benefits: ['Azot bağlar'] },
          { year: 3, season: 'spring', crop: 'Mısır', family: 'Tahıl', benefits: ['Derin kök sistemi'] },
          { year: 3, season: 'autumn', crop: 'Ayçiçeği', family: 'Yağlı tohum', benefits: ['Toprak yapısını iyileştirir'] }
        ]
      },
      'kumlu': {
        name: 'Kumlu Toprak Rotasyonu',
        description: 'Kumlu topraklar için uygun ekin sıralaması',
        sequence: [
          { year: 1, season: 'spring', crop: 'Arpa', family: 'Tahıl', benefits: ['Hızlı gelişir'] },
          { year: 1, season: 'autumn', crop: 'Çavdar', family: 'Tahıl', benefits: ['Soğuğa dayanıklı'] },
          { year: 2, season: 'spring', crop: 'Nohut', family: 'Baklagil', benefits: ['Azot bağlar', 'Kuraklığa dayanıklı'] },
          { year: 2, season: 'autumn', crop: 'Mercimek', family: 'Baklagil', benefits: ['Azot bağlar'] },
          { year: 3, season: 'spring', crop: 'Darı', family: 'Tahıl', benefits: ['Kuraklığa dayanıklı'] },
          { year: 3, season: 'autumn', crop: 'Kanola', family: 'Yağlı tohum', benefits: ['Toprak yapısını iyileştirir'] }
        ]
      },
      'organik': {
        name: 'Organik Tarım Rotasyonu',
        description: 'Organik tarım için özel rotasyon planı',
        sequence: [
          { year: 1, season: 'spring', crop: 'Buğday', family: 'Tahıl', benefits: ['Temel besin kaynağı'] },
          { year: 1, season: 'autumn', crop: 'Arpa', family: 'Tahıl', benefits: ['Erozyonu önler'] },
          { year: 2, season: 'spring', crop: 'Fasulye', family: 'Baklagil', benefits: ['Azot bağlar', 'Zararlıları uzaklaştırır'] },
          { year: 2, season: 'autumn', crop: 'Mercimek', family: 'Baklagil', benefits: ['Azot bağlar'] },
          { year: 3, season: 'spring', crop: 'Mısır', family: 'Tahıl', benefits: ['Derin kök sistemi'] },
          { year: 3, season: 'autumn', crop: 'Ayçiçeği', family: 'Yağlı tohum', benefits: ['Faydalı böcekleri çeker'] },
          { year: 4, season: 'spring', crop: 'Patates', family: 'Yumru', benefits: ['Toprak yapısını iyileştirir'] },
          { year: 4, season: 'autumn', crop: 'Yonca', family: 'Baklagil', benefits: ['Azot bağlar', 'Hayvan yemi'] }
        ]
      }
    };

    return {
      field_id: fieldId,
      soil_type: soilType,
      recommendations: recommendations[soilType] || recommendations['organik'],
      benefits: [
        'Toprak verimliliğini artırır',
        'Zararlı ve hastalık riskini azaltır',
        'Azot bağlayıcı bitkiler toprağı zenginleştirir',
        'Erozyonu önler',
        'Pestisit kullanımını azaltır',
        'Maliyeti düşürür'
      ]
    };
  }

  async getCompanionPlantingSuggestions(cropName: string): Promise<any> {
    // Yan yana ekim önerileri
    const companionPlants = {
      'Buğday': ['Fasulye', 'Mercimek', 'Nohut'],
      'Mısır': ['Fasulye', 'Kabak', 'Salatalık'],
      'Domates': ['Fesleğen', 'Sarımsak', 'Soğan', 'Marul'],
      'Patates': ['Fasulye', 'Mısır', 'Lahana'],
      'Fasulye': ['Mısır', 'Patates', 'Havuç'],
      'Lahana': ['Domates', 'Patates', 'Soğan'],
      'Havuç': ['Soğan', 'Fasulye', 'Marul'],
      'Salatalık': ['Mısır', 'Fasulye', 'Marul'],
      'Kabak': ['Mısır', 'Fasulye', 'Salatalık'],
      'Soğan': ['Havuç', 'Lahana', 'Domates']
    };

    return {
      main_crop: cropName,
      companion_plants: companionPlants[cropName] || [],
      benefits: [
        'Zararlı böcekleri uzaklaştırır',
        'Toprak verimliliğini artırır',
        'Hastalık riskini azaltır',
        'Alan kullanımını optimize eder',
        'Gölge ve rüzgar koruması sağlar'
      ]
    };
  }

  async calculateRotationBenefits(rotationPlan: CropRotationPlan): Promise<any> {
    const sequence = rotationPlan.rotation_sequence;
    let nitrogenFixers = 0;
    let pestRepellents = 0;
    let soilImprovers = 0;
    let totalYears = rotationPlan.duration_years;

    sequence.forEach(year => {
      if (year.nitrogen_fixation) nitrogenFixers++;
      if (year.pest_repellent) pestRepellents++;
      if (year.soil_improvement) soilImprovers++;
    });

    const benefits = {
      nitrogen_fixation_ratio: (nitrogenFixers / sequence.length) * 100,
      pest_repellent_ratio: (pestRepellents / sequence.length) * 100,
      soil_improvement_ratio: (soilImprovers / sequence.length) * 100,
      estimated_yield_increase: Math.min(25, (nitrogenFixers * 5) + (pestRepellents * 3) + (soilImprovers * 4)),
      estimated_cost_savings: (nitrogenFixers * 500) + (pestRepellents * 300) + (soilImprovers * 400),
      sustainability_score: Math.min(100, (nitrogenFixers * 20) + (pestRepellents * 15) + (soilImprovers * 18))
    };

    return benefits;
  }
} 
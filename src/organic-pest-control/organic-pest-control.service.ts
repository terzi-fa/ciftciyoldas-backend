import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganicPestControl } from './entities/organic-pest-control.entity';
import { CreateOrganicPestControlDto } from './dto/create-organic-pest-control.dto';

@Injectable()
export class OrganicPestControlService {
  constructor(
    @InjectRepository(OrganicPestControl)
    private organicPestControlRepository: Repository<OrganicPestControl>,
  ) {}

  async create(createDto: CreateOrganicPestControlDto, userId: number): Promise<OrganicPestControl> {
    const pestControl = this.organicPestControlRepository.create({
      ...createDto,
      user_id: userId,
      application_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.organicPestControlRepository.save(pestControl);
  }

  async findAll(userId: number): Promise<OrganicPestControl[]> {
    return this.organicPestControlRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<OrganicPestControl> {
    const pestControl = await this.organicPestControlRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!pestControl) {
      throw new NotFoundException('Organik zararlı mücadelesi kaydı bulunamadı');
    }

    return pestControl;
  }

  async getEffectivenessByField(fieldId: number, userId: number): Promise<any> {
    const controls = await this.organicPestControlRepository.find({
      where: { field_id: fieldId, user_id: userId },
    });

    const effectiveness = controls.reduce((acc, control) => {
      if (!acc[control.pest_type]) {
        acc[control.pest_type] = [];
      }
      acc[control.pest_type].push({
        pest_name: control.pest_name,
        method: control.control_method,
        effectiveness: control.effectiveness,
        date: control.application_date,
      });
      return acc;
    }, {});

    return {
      field_id: fieldId,
      total_applications: controls.length,
      effectiveness_by_pest_type: effectiveness,
      average_effectiveness: controls.length > 0 
        ? controls.reduce((sum, c) => sum + c.effectiveness, 0) / controls.length 
        : 0,
    };
  }

  async getCompanionPlantingRecommendations(cropName: string): Promise<any> {
    // Yan yana ekim önerileri
    const companionPlantingMap = {
      // Meyve Ağaçları
      'Antepfıstığı': ['Adaçayı', 'Kekik'],
      'Fındık': ['Yonca'],
      'Kiraz': ['Sarımsak', 'Nane'],
      'Narenciye': ['Kadife çiçeği'],
      'Zeytin': ['Lavanta', 'Kekik'],
      'Üzüm': ['Adaçayı', 'Biberiye'],
      
      // Sebzeler
      'Domates': ['Fesleğen', 'Sarımsak', 'Soğan', 'Marul'],
      'Patates': ['Fasulye', 'Mısır', 'Lahana'],
      'Lahana': ['Domates', 'Patates', 'Soğan'],
      'Havuç': ['Soğan', 'Fasulye', 'Marul'],
      'Soğan': ['Havuç', 'Marul'],
      'Salatalık': ['Ayçiçeği', 'Mısır', 'Fasulye', 'Dereotu'],

      // Endüstriyel Bitkiler
      'Ayçiçeği': ['Salatalık', 'Soğan'],
      'Mısır': ['Fasulye', 'Kabak', 'Salatalık'],

      // Baklagiller
      'Fasulye': ['Mısır', 'Patates', 'Havuç'],
      'Mercimek': ['Havuç', 'Salatalık'], // Patates, besin rekabeti nedeniyle kaldırıldı
      'Nohut': ['Buğday', 'Salatalık', 'Rezene'],

      // Tahıllar
      'Buğday': ['Fasulye', 'Nohut'],
      'Arpa': ['Fasulye', 'Mercimek', 'Nohut'], // Baklagillerle iyi gider
    };

    return {
      main_crop: cropName,
      companion_plants: companionPlantingMap[cropName] || [],
      benefits: [
        'Zararlı böcekleri uzaklaştırır',
        'Toprak verimliliğini artırır',
        'Hastalık riskini azaltır',
        'Alan kullanımını optimize eder'
      ]
    };
  }

  async getBiologicalControlRecommendations(pestType: string): Promise<any> {
    // Biyolojik mücadele önerileri
    const biologicalControls = {
      'disease': {
        recommendations: [
          { 
            name: 'Trichoderma harzianum',
            details: [
              'Etki Mekanizması: Rizosferde kolonize olur, antagonizma yoluyla patojenleri baskılar, bitki köklerinde direnç artırır.',
              'Etkili Olduğu Hastalıklar: Kök çürüklükleri (Fusarium, Rhizoctonia), Solgunluk hastalıkları.',
              'Uygulama Dozu: 5-10 kg/ha toprak uygulaması.',
              'Etkinlik Süresi: 3-6 ay.'
            ]
          },
          { 
            name: 'Bacillus subtilis',
            details: [
              'Etki Mekanizması: Antibiyotik üretimi, patojen sporlarının çimlenmesini engeller.',
              'Etkili Olduğu Hastalıklar: Bakteriyel leke (Xanthomonas), Mildiyö (Pseudomonas fluorescens ile kombine).',
              'Uygulama Dozu: 1-2 L/ha (1x10^8 CFU/ml).'
            ]
          }
        ]
      },
      'insect': {
        recommendations: [
          {
            name: 'Uğur Böceği (Coccinella septempunctata)',
            details: [
              'Av Kapasitesi: Günde 50-100 yaprak biti.',
              'Salım Zamanı: İlk yaprak biti görüldüğünde.',
              'Salım Miktarı: 5-10 böcek/m².'
            ]
          },
          {
            name: 'Parazitoid Arı (Trichogramma spp.)',
            details: [
              'Hedef Zararlılar: Pamuk kurdu, Mısır kurdu.',
              'Salım Sıklığı: Haftada 1 kez, 3-4 uygulama.',
              'Etkinlik Artırıcı: Tuzak bitkilerle desteklenmeli.'
            ]
          },
          {
            name: 'Bacillus thuringiensis (Bt)',
            details: [
              'Etkili Olduğu Zararlılar: Lahana kelebeği, Mısır kurdu.',
              'Kritik Uygulama Zamanı: Larva dönemi.',
              'Dozaj: 0.5-1 kg/ha (10^7 IU/mg).'
            ]
          }
        ]
      },
      'nematode': {
        recommendations: [
          {
            name: 'Paecilomyces lilacinus',
            details: [
              'Etki Mekanizması: Nematod yumurtalarını parazitler.',
              'Uygulama Dozu: 2-4 kg/ha.',
              'Etkinlik Süresi: 4-8 hafta.'
            ]
          },
          {
            name: 'Kültürel Önlemler',
            details: [
              'Nematod baskılı topraklarda marigold (kadife çiçeği) ekimi.',
              'Toprak solarizasyonu ile desteklenmeli.'
            ]
          }
        ]
      },
      'weed': {
        recommendations: [
          {
            name: 'Allelopatik Bitkiler: Çavdar (Secale cereale)',
            details: [
              'Etkili Maddeler: DIBOA, BOA.',
              'Uygulama: Hasat sonrası anız olarak bırakma.',
              'Etkinlik Oranı: %60-70 yabani ot baskılama.'
            ]
          },
          {
            name: 'Mikorizal Mantarlar (Glomus spp.)',
            details: [
              'Faydaları: Kültür bitkilerinin rekabet gücünü artırır, toprak yapısını iyileştirir.',
              'Uygulama Dozu: 100-200 kg/ha mikorizal aşılı toprak.'
            ]
          }
        ]
      },
      'rodent': {
        recommendations: [
          {
            name: 'Yırtıcı Kuşlar İçin Yuvalama Platformları',
            details: [
              'Etkili Türler: Kerkenez, baykuş.',
              'Yuva Başına Kontrol Alanı: 5-10 hektar.'
            ]
          },
          {
            name: 'Biyolojik Repellantler (Kovucular)',
            details: [
              'Etken Madde: Kaprisik asit (hindistancevizi yağı).',
              'Uygulama: Çevre bariyeri olarak %2\'lik solüsyon.'
            ]
          }
        ]
      }
    };

    const result = biologicalControls[pestType] || { recommendations: [], application_tips: [] };

    return {
      pest_type: pestType,
      recommendations: result.recommendations,
      application_tips: [
        'Zamanlama: Sabah erken veya akşamüstü, rüzgarsız günlerde uygulama yapın.',
        'Kombinasyonlar: Trichoderma + Mikoriza (sinerjik etki), Bt + Uğur böceği (katmanlı koruma).',
        'Takip: Uygulama sonrası 7, 14 ve 21. günlerde kontrol edin.',
        'Depolama: Canlı ajanları 4-8°C\'de saklayın ve son kullanma tarihlerine dikkat edin.'
      ]
    };
  }
} 
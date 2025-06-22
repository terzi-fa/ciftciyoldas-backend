import { DataSource } from 'typeorm';
import { CropRotationPlan, Season } from '../../crop-rotation/entities/crop-rotation-plan.entity';

export const cropRotationSeed = async (dataSource: DataSource) => {
  const cropRotationRepository = dataSource.getRepository(CropRotationPlan);

  const rotationPlans = [
    {
      user_id: 1,
      field_id: 1,
      name: 'Organik Buğday Rotasyonu',
      description: 'Buğday ağırlıklı organik rotasyon planı',
      duration_years: 4,
      rotation_type: 'organic',
      rotation_sequence: [
        {
          year: 1,
          season: Season.SPRING,
          crop_type_id: 1,
          crop_name: 'Buğday',
          crop_family: 'Tahıl',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Temel besin kaynağı',
          companion_plants: ['Fasulye', 'Mercimek']
        },
        {
          year: 1,
          season: Season.AUTUMN,
          crop_type_id: 9,
          crop_name: 'Arpa',
          crop_family: 'Tahıl',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Erozyonu önler'
        },
        {
          year: 2,
          season: Season.SPRING,
          crop_type_id: 11,
          crop_name: 'Mercimek',
          crop_family: 'Baklagil',
          nitrogen_fixation: true,
          pest_repellent: true,
          soil_improvement: true,
          notes: 'Azot bağlar, zararlıları uzaklaştırır'
        },
        {
          year: 2,
          season: Season.AUTUMN,
          crop_type_id: 12,
          crop_name: 'Nohut',
          crop_family: 'Baklagil',
          nitrogen_fixation: true,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Azot bağlar'
        },
        {
          year: 3,
          season: Season.SPRING,
          crop_type_id: 2,
          crop_name: 'Mısır',
          crop_family: 'Tahıl',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Derin kök sistemi'
        },
        {
          year: 3,
          season: Season.AUTUMN,
          crop_type_id: 4,
          crop_name: 'Ayçiçeği',
          crop_family: 'Yağlı tohum',
          nitrogen_fixation: false,
          pest_repellent: true,
          soil_improvement: true,
          notes: 'Faydalı böcekleri çeker'
        },
        {
          year: 4,
          season: Season.SPRING,
          crop_type_id: 7,
          crop_name: 'Patates',
          crop_family: 'Yumru',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Toprak yapısını iyileştirir'
        },
        {
          year: 4,
          season: Season.AUTUMN,
          crop_type_id: 13,
          crop_name: 'Yonca',
          crop_family: 'Baklagil',
          nitrogen_fixation: true,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Azot bağlar, hayvan yemi'
        }
      ],
      is_active: true,
      expected_yield_increase: 20,
      estimated_cost_savings: 2500,
      benefits: 'Toprak verimliliği artar, pestisit kullanımı azalır, maliyet düşer',
      challenges: 'İlk yıllarda verim düşük olabilir, planlı ekim gerektirir'
    },
    {
      user_id: 1,
      field_id: 2,
      name: 'Killi Toprak Rotasyonu',
      description: 'Killi topraklar için özel rotasyon planı',
      duration_years: 3,
      rotation_type: 'traditional',
      rotation_sequence: [
        {
          year: 1,
          season: Season.SPRING,
          crop_type_id: 1,
          crop_name: 'Buğday',
          crop_family: 'Tahıl',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Toprak yapısını iyileştirir'
        },
        {
          year: 1,
          season: Season.AUTUMN,
          crop_type_id: 9,
          crop_name: 'Arpa',
          crop_family: 'Tahıl',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Erozyonu önler'
        },
        {
          year: 2,
          season: Season.SPRING,
          crop_type_id: 11,
          crop_name: 'Mercimek',
          crop_family: 'Baklagil',
          nitrogen_fixation: true,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Azot bağlar'
        },
        {
          year: 2,
          season: Season.AUTUMN,
          crop_type_id: 12,
          crop_name: 'Nohut',
          crop_family: 'Baklagil',
          nitrogen_fixation: true,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Azot bağlar'
        },
        {
          year: 3,
          season: Season.SPRING,
          crop_type_id: 2,
          crop_name: 'Mısır',
          crop_family: 'Tahıl',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Derin kök sistemi'
        },
        {
          year: 3,
          season: Season.AUTUMN,
          crop_type_id: 4,
          crop_name: 'Ayçiçeği',
          crop_family: 'Yağlı tohum',
          nitrogen_fixation: false,
          pest_repellent: false,
          soil_improvement: true,
          notes: 'Toprak yapısını iyileştirir'
        }
      ],
      is_active: true,
      expected_yield_increase: 15,
      estimated_cost_savings: 1800,
      benefits: 'Killi toprak yapısını iyileştirir, su tutma kapasitesini artırır',
      challenges: 'Killi toprakta çalışma zorluğu'
    }
  ];

  for (const rotationPlan of rotationPlans) {
    const existingPlan = await cropRotationRepository.findOne({
      where: { 
        user_id: rotationPlan.user_id,
        field_id: rotationPlan.field_id,
        name: rotationPlan.name
      }
    });

    if (!existingPlan) {
      await cropRotationRepository.save({
        ...rotationPlan,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
  }
}; 
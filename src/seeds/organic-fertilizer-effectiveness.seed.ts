import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { OrganicFertilizerEffectiveness } from '../organic-fertilizers/entities/organic-fertilizer-effectiveness.entity';

export default class CreateOrganicFertilizerEffectiveness implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(OrganicFertilizerEffectiveness);

    const sampleData = [
      {
        user_id: 1,
        fertilizer_id: 1, // Kompost
        crop_type_id: 1, // Buğday
        growth_stage_id: 1, // Çimlenme
        effectiveness: 'yüksek',
        soil_health_impact: 'positive',
        cost: 1500.00,
        application_date: new Date('2024-03-01'),
        notes: 'İlkbahar uygulaması - Toprak hazırlığı',
      },
      {
        user_id: 1,
        fertilizer_id: 2, // Yeşil gübre
        crop_type_id: 1,
        growth_stage_id: 2, // Sapa kalkma
        effectiveness: 'orta',
        soil_health_impact: 'positive',
        cost: 800.00,
        application_date: new Date('2024-03-15'),
        notes: 'Ara ekim uygulaması',
      },
      {
        user_id: 1,
        fertilizer_id: 3, // Solucan gübresi
        crop_type_id: 1,
        growth_stage_id: 3, // Başaklanma
        effectiveness: 'yüksek',
        soil_health_impact: 'positive',
        cost: 2000.00,
        application_date: new Date('2024-04-01'),
        notes: 'Başaklanma öncesi uygulama',
      },
    ];

    for (const data of sampleData) {
      const record = repository.create(data);
      await repository.save(record);
    }
  }
} 
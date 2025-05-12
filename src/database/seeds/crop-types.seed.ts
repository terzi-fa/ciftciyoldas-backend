import { DataSource } from 'typeorm';
import { CropType } from '../../organic-fertilizers/entities/crop-type.entity';

export const cropTypesSeed = async (dataSource: DataSource) => {
  const cropTypeRepository = dataSource.getRepository(CropType);

  const cropTypes = [
    {
      name: 'Buğday',
      description: 'Tahıl ürünü'
    },
    {
      name: 'Mısır',
      description: 'Tahıl ürünü'
    },
    {
      name: 'Domates',
      description: 'Sebze ürünü'
    },
    {
      name: 'Ayçiçeği',
      description: 'Yağlı tohum'
    },
    {
      name: 'Pamuk',
      description: 'Endüstriyel bitki'
    },
    {
      name: 'Soya',
      description: 'Yağlı tohum'
    },
    {
      name: 'Patates',
      description: 'Yumru bitki'
    },
    {
      name: 'Şeker Pancarı',
      description: 'Endüstriyel bitki'
    },
    {
      name: 'Arpa',
      description: 'Tahıl ürünü'
    },
    {
      name: 'Çeltik',
      description: 'Tahıl ürünü'
    },
    {
      name: 'Mercimek',
      description: 'Baklagil'
    },
    {
      name: 'Nohut',
      description: 'Baklagil'
    },
    {
      name: 'Fasulye',
      description: 'Baklagil'
    },
    {
      name: 'Kanola',
      description: 'Yağlı tohum'
    }
  ];

  for (const cropType of cropTypes) {
    const existingCropType = await cropTypeRepository.findOne({
      where: { name: cropType.name }
    });

    if (!existingCropType) {
      await cropTypeRepository.save(cropType);
    }
  }
}; 
import { DataSource } from 'typeorm';
import { OrganicPestControl } from '../../organic-pest-control/entities/organic-pest-control.entity';

export const organicPestControlSeed = async (dataSource: DataSource) => {
  const pestControlRepository = dataSource.getRepository(OrganicPestControl);

  const pestControls = [
    {
      user_id: 1,
      field_id: 1,
      pest_name: 'Yaprak Biti',
      pest_type: 'insect',
      control_method: 'biological',
      description: 'Uğur böceği salımı ile yaprak biti mücadelesi',
      beneficial_organisms: 'Uğur böceği (Coccinella septempunctata)',
      effectiveness: 85,
      cost: 150,
      application_date: new Date('2024-03-15'),
      is_preventive: true,
      is_curative: false,
      notes: 'İlkbahar başında uygulandı, etkili sonuç alındı'
    },
    {
      user_id: 1,
      field_id: 1,
      pest_name: 'Tırtıl',
      pest_type: 'insect',
      control_method: 'biological',
      description: 'Bacillus thuringiensis ile tırtıl mücadelesi',
      beneficial_organisms: 'Bacillus thuringiensis var. kurstaki',
      effectiveness: 90,
      cost: 200,
      application_date: new Date('2024-04-20'),
      is_preventive: false,
      is_curative: true,
      notes: 'Akşam saatlerinde uygulandı'
    },
    {
      user_id: 1,
      field_id: 2,
      pest_name: 'Mantar Hastalığı',
      pest_type: 'disease',
      control_method: 'biological',
      description: 'Trichoderma harzianum ile mantar mücadelesi',
      beneficial_organisms: 'Trichoderma harzianum',
      effectiveness: 75,
      cost: 180,
      application_date: new Date('2024-05-10'),
      is_preventive: true,
      is_curative: true,
      notes: 'Toprak uygulaması yapıldı'
    },
    {
      user_id: 1,
      field_id: 2,
      pest_name: 'Yabani Ot',
      pest_type: 'weed',
      control_method: 'cultural',
      description: 'Yan yana ekim ile yabani ot mücadelesi',
      companion_plants: 'Fasulye, Marul',
      cultural_practices: 'Sık ekim, erken hasat',
      effectiveness: 70,
      cost: 50,
      application_date: new Date('2024-03-01'),
      is_preventive: true,
      is_curative: false,
      notes: 'Fasulye ve marul yan yana ekildi'
    }
  ];

  for (const pestControl of pestControls) {
    const existingPestControl = await pestControlRepository.findOne({
      where: { 
        user_id: pestControl.user_id,
        field_id: pestControl.field_id,
        pest_name: pestControl.pest_name,
        application_date: pestControl.application_date
      }
    });

    if (!existingPestControl) {
      await pestControlRepository.save({
        ...pestControl,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
  }
}; 
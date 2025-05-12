import { DataSource } from 'typeorm';
import { GrowthStage } from '../../organic-fertilizers/entities/growth-stage.entity';

export const growthStagesSeed = async (dataSource: DataSource) => {
  const growthStageRepository = dataSource.getRepository(GrowthStage);

  const growthStages = [
    // Buğday için büyüme dönemleri
    {
      name: 'Çimlenme Dönemi',
      description: 'Tohumun çimlenmesi ve ilk yaprakların oluşması',
      duration_days: 14,
      optimal_temperature: 20,
      optimal_humidity: 70,
      fertilizer_application_notes: 'Bu dönemde azot ağırlıklı gübreleme önerilir',
      crop_type_id: 1, // Buğday ID'si
      fertilizer_id: 1 // Uygun gübre ID'si
    },
    {
      name: 'Kardeşlenme Dönemi',
      description: 'Bitkinin yan sürgünler oluşturması',
      duration_days: 30,
      optimal_temperature: 22,
      optimal_humidity: 65,
      fertilizer_application_notes: 'Fosfor ve potasyum içerikli gübreleme önerilir',
      crop_type_id: 1,
      fertilizer_id: 2
    },
    {
      name: 'Sapa Kalkma Dönemi',
      description: 'Bitkinin sap oluşturması ve boylanması',
      duration_days: 45,
      optimal_temperature: 25,
      optimal_humidity: 60,
      fertilizer_application_notes: 'Azot ve potasyum dengeli gübreleme önerilir',
      crop_type_id: 1,
      fertilizer_id: 3
    },
    {
      name: 'Başaklanma Dönemi',
      description: 'Başakların oluşması ve gelişmesi',
      duration_days: 30,
      optimal_temperature: 28,
      optimal_humidity: 55,
      fertilizer_application_notes: 'Potasyum ağırlıklı gübreleme önerilir',
      crop_type_id: 1,
      fertilizer_id: 4
    },

    // Mısır için büyüme dönemleri
    {
      name: 'Çimlenme Dönemi',
      description: 'Tohumun çimlenmesi ve ilk yaprakların oluşması',
      duration_days: 10,
      optimal_temperature: 25,
      optimal_humidity: 75,
      fertilizer_application_notes: 'Azot ağırlıklı gübreleme önerilir',
      crop_type_id: 2, // Mısır ID'si
      fertilizer_id: 1
    },
    {
      name: 'Yaprak Gelişimi',
      description: 'Yaprakların gelişmesi ve büyümesi',
      duration_days: 40,
      optimal_temperature: 28,
      optimal_humidity: 70,
      fertilizer_application_notes: 'Azot ve fosfor dengeli gübreleme önerilir',
      crop_type_id: 2,
      fertilizer_id: 2
    },
    {
      name: 'Koçan Oluşumu',
      description: 'Koçanların oluşması ve gelişmesi',
      duration_days: 35,
      optimal_temperature: 30,
      optimal_humidity: 65,
      fertilizer_application_notes: 'Fosfor ve potasyum ağırlıklı gübreleme önerilir',
      crop_type_id: 2,
      fertilizer_id: 3
    },
    {
      name: 'Olgunlaşma Dönemi',
      description: 'Koçanların olgunlaşması',
      duration_days: 25,
      optimal_temperature: 28,
      optimal_humidity: 60,
      fertilizer_application_notes: 'Potasyum ağırlıklı gübreleme önerilir',
      crop_type_id: 2,
      fertilizer_id: 4
    },

    // Domates için büyüme dönemleri
    {
      name: 'Çimlenme Dönemi',
      description: 'Tohumun çimlenmesi ve fide oluşumu',
      duration_days: 12,
      optimal_temperature: 24,
      optimal_humidity: 80,
      fertilizer_application_notes: 'Azot ağırlıklı gübreleme önerilir',
      crop_type_id: 3, // Domates ID'si
      fertilizer_id: 1
    },
    {
      name: 'Fide Gelişimi',
      description: 'Fidenin büyümesi ve yaprak oluşumu',
      duration_days: 30,
      optimal_temperature: 26,
      optimal_humidity: 75,
      fertilizer_application_notes: 'Azot ve fosfor dengeli gübreleme önerilir',
      crop_type_id: 3,
      fertilizer_id: 2
    },
    {
      name: 'Çiçeklenme Dönemi',
      description: 'Çiçeklerin oluşması ve açması',
      duration_days: 25,
      optimal_temperature: 28,
      optimal_humidity: 70,
      fertilizer_application_notes: 'Fosfor ağırlıklı gübreleme önerilir',
      crop_type_id: 3,
      fertilizer_id: 3
    },
    {
      name: 'Meyve Oluşumu',
      description: 'Meyvelerin oluşması ve büyümesi',
      duration_days: 40,
      optimal_temperature: 30,
      optimal_humidity: 65,
      fertilizer_application_notes: 'Potasyum ağırlıklı gübreleme önerilir',
      crop_type_id: 3,
      fertilizer_id: 4
    },
    {
      name: 'Çimlenme & Fide',
      description: 'Tohumun çimlenmesi ve ilk yaprakların oluşması',
      duration_days: 14,
      optimal_temperature: 22,
      optimal_humidity: 75,
      fertilizer_application_notes: 'Genel yetersizlik durumunda solucan gübresi ve organik kompost çayı, Azot eksikliğinde fermente hayvan gübresi ve yeşil gübreleme önerilir'
    },
    {
      name: 'Yapraklanma & Boylanma',
      description: 'Yaprakların gelişimi ve bitkinin boylanması',
      duration_days: 30,
      optimal_temperature: 24,
      optimal_humidity: 70,
      fertilizer_application_notes: 'Azot düşükse tavuk gübresi ve sıvı solucan gübresi, Potasyum düşükse odun külü ve kompostlaştırılmış muz kabuğu önerilir'
    },
    {
      name: 'Tomurcuk – Çiçeklenme',
      description: 'Tomurcukların oluşması ve çiçeklenme dönemi',
      duration_days: 25,
      optimal_temperature: 28,
      optimal_humidity: 60,
      fertilizer_application_notes: 'Fosfor düşükse kemik unu, balık emülsiyonu ve guano, Çinko-Bor eksikse mikroelementli sıvı organik gübre ve deniz yosunu özü önerilir'
    },
    {
      name: 'Çekirdek Dolumu',
      description: 'Çekirdeklerin oluşması ve dolgunlaşması',
      duration_days: 35,
      optimal_temperature: 30,
      optimal_humidity: 55,
      fertilizer_application_notes: 'Potasyum düşükse odun külü, melaslı organik gübre ve kompost çayı, Magnezyum eksikse epsom tuzu ve deniz yosunu önerilir'
    },
    {
      name: 'Sarıma – Olgunlaşma',
      description: 'Bitkinin sararması ve olgunlaşması',
      duration_days: 20,
      optimal_temperature: 25,
      optimal_humidity: 50,
      fertilizer_application_notes: 'Bu dönemde gübre verilmez, sulama kontrolü önemlidir'
    }
  ];

  for (const growthStage of growthStages) {
    const existingStage = await growthStageRepository.findOne({
      where: {
        name: growthStage.name,
        crop_type_id: growthStage.crop_type_id
      }
    });

    if (!existingStage) {
      await growthStageRepository.save(growthStage);
    }
  }
}; 
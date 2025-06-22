import { DataSource } from 'typeorm';
import { growthStagesSeed } from './seeds/growth-stages.seed';
import { cropTypesSeed } from './seeds/crop-types.seed';
import { organicPestControlSeed } from './seeds/organic-pest-control.seed';
import { cropRotationSeed } from './seeds/crop-rotation.seed';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'data.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('Veritabanı bağlantısı başarılı');

    // Ekin türlerini ekle
    await cropTypesSeed(dataSource);
    console.log('Ekin türleri başarıyla eklendi');

    // Büyüme dönemlerini ekle
    await growthStagesSeed(dataSource);
    console.log('Büyüme dönemleri başarıyla eklendi');

    // Organik zararlı mücadelesi kayıtlarını ekle
    await organicPestControlSeed(dataSource);
    console.log('Organik zararlı mücadelesi kayıtları başarıyla eklendi');

    // Ekin rotasyonu planlarını ekle
    await cropRotationSeed(dataSource);
    console.log('Ekin rotasyonu planları başarıyla eklendi');

    await dataSource.destroy();
    console.log('Veritabanı bağlantısı kapatıldı');
  } catch (error) {
    console.error('Seed işlemi sırasında hata:', error);
    process.exit(1);
  }
}

runSeeds(); 
import { DataSource } from 'typeorm';
import { growthStagesSeed } from './seeds/growth-stages.seed';

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

    // Büyüme dönemlerini ekle
    await growthStagesSeed(dataSource);
    console.log('Büyüme dönemleri başarıyla eklendi');

    await dataSource.destroy();
    console.log('Veritabanı bağlantısı kapatıldı');
  } catch (error) {
    console.error('Seed işlemi sırasında hata:', error);
    process.exit(1);
  }
}

runSeeds(); 
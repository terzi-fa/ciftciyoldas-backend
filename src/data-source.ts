import { DataSource } from 'typeorm';
import { News } from './news/entities/news.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data.sqlite',
  entities: [News],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource; 
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

const isCompiled = path.extname(__filename) === '.js';

export default new DataSource({
  type: 'sqlite',
  database: 'data.sqlite',
  entities: [
    isCompiled
      ? path.join(__dirname, '**', '*.entity.js')
      : path.join(__dirname, '..', '**', '*.entity.ts'),
  ],
  migrations: [
    isCompiled
      ? path.join(__dirname, 'migrations', '*.js')
      : path.join(__dirname, '..', 'migrations', '*.ts'),
  ],
  synchronize: false,
}); 
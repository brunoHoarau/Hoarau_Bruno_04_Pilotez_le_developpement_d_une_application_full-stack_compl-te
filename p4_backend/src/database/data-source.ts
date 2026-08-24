import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrationsRun: true,
  synchronize: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);

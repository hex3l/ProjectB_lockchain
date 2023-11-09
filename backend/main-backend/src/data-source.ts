import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/user.entity';
import { config } from 'dotenv';
config();

export const AppDataSourceBuilder = () => {
  console.log(process.env);
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });
};

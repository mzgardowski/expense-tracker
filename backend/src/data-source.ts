import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Expense } from './expenses/entities/expense.entity';
import { parseMssqlConnectionString } from './config/connection-string.parser';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING ?? '';
const {
  host,
  port,
  username,
  password,
  database,
  encrypt,
  trustServerCertificate,
} = parseMssqlConnectionString(connectionString);

export const AppDataSource = new DataSource({
  type: 'mssql',
  host,
  port,
  username,
  password,
  database,
  entities: [Expense],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  options: {
    encrypt,
    trustServerCertificate,
  },
});

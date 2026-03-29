import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Expense } from './expenses/entities/expense.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  username: process.env.DB_USER ?? 'dbadmin',
  password: process.env.DB_PASSWORD ?? 'ZAQ!2wsx',
  database: process.env.DB_NAME ?? 'db-expenses-manager-95964',
  entities: [Expense],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
});

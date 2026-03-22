import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Expense } from './expenses/entities/expense.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  username: process.env.DB_USER ?? 'sa',
  password: process.env.DB_PASSWORD ?? 'StrongPassword123!',
  database: process.env.DB_NAME ?? 'expense_tracker',
  entities: [Expense],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

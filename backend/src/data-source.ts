import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Expense } from './expenses/entities/expense.entity';

/**
 * DataSource for TypeORM CLI migrations.
 * Uses env vars — in CI/CD, fetch secrets from Key Vault and pass as env vars.
 * Locally, use .env file with direct DB credentials.
 */
export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  username: process.env.DB_USERNAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? '',
  entities: [Expense],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  options: {
    encrypt: process.env.DB_ENCRYPT !== 'false',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
});

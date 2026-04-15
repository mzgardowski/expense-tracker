import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { Expense } from './expenses/entities/expense.entity';
import { parseMssqlConnectionString } from './config/connection-string.parser';

dotenv.config();

/**
 * DataSource for TypeORM CLI migrations.
 * Fetches connection string from Azure Key Vault (requires `az login` locally).
 */
async function buildDataSource(): Promise<DataSource> {
  const vaultUrl = process.env.KEY_VAULT_URL;
  if (!vaultUrl) {
    throw new Error(
      'KEY_VAULT_URL is not set — cannot fetch DB connection string',
    );
  }

  const credential = new DefaultAzureCredential();
  const client = new SecretClient(vaultUrl, credential);
  const secret = await client.getSecret('DbConnectionString');

  if (!secret.value) {
    throw new Error('DbConnectionString secret is empty in Key Vault');
  }

  const {
    host,
    port,
    username,
    password,
    database,
    encrypt,
    trustServerCertificate,
  } = parseMssqlConnectionString(secret.value);

  return new DataSource({
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
}

export const AppDataSource = buildDataSource();

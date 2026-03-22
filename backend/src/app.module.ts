import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionPool, config as MssqlConfig } from 'mssql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Expense } from './expenses/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';

async function ensureDatabaseExists() {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = parseInt(process.env.DB_PORT ?? '1433', 10);
  const user = process.env.DB_USER ?? 'sa';
  const password = process.env.DB_PASSWORD ?? 'StrongPassword123!';
  const database = process.env.DB_NAME ?? 'expense_tracker';

  const config: MssqlConfig = {
    server: host,
    port,
    user,
    password,
    database: 'master',
    options: { encrypt: false, trustServerCertificate: true },
  };

  const pool: ConnectionPool = await new ConnectionPool(config).connect();

  await pool
    .request()
    .query(
      `IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${database}') CREATE DATABASE [${database}]`,
    );

  await pool.close();
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await ensureDatabaseExists();
        return {
          type: 'mssql',
          host: process.env.DB_HOST ?? 'localhost',
          port: parseInt(process.env.DB_PORT ?? '1433', 10),
          username: process.env.DB_USER ?? 'sa',
          password: process.env.DB_PASSWORD ?? 'StrongPassword123!',
          database: process.env.DB_NAME ?? 'expense_tracker',
          entities: [Expense],
          synchronize: false,
          migrations: [__dirname + '/migrations/*.{js,ts}'],
          migrationsRun: true,
          options: {
            encrypt: false,
            trustServerCertificate: true,
          },
        };
      },
    }),
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

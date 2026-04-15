import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureKeyVaultModule } from './azure-key-vault/azure-key-vault.module';
import { fetchSecret } from './azure-key-vault/azure-key-vault.service';
import { parseMssqlConnectionString } from './config/connection-string.parser';
import { envValidationSchema } from './config/env.validation';
import { Expense } from './expenses/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseConfig');
        const keyVaultUrl = configService.getOrThrow<string>('KEY_VAULT_URL');

        logger.log('Fetching DbConnectionString from Azure Key Vault...');
        const connectionString = await fetchSecret(
          keyVaultUrl,
          'DbConnectionString',
        );

        const {
          host,
          port,
          username,
          password,
          database,
          encrypt,
          trustServerCertificate,
        } = parseMssqlConnectionString(connectionString);
        logger.log(`Database connection configured for host: ${host}`);

        return {
          type: 'mssql' as const,
          host,
          port,
          username,
          password,
          database,
          entities: [Expense],
          synchronize: false,
          migrations: [__dirname + '/migrations/*.{js,ts}'],
          migrationsRun: true,
          options: {
            encrypt,
            trustServerCertificate,
          },
        };
      },
    }),
    AzureKeyVaultModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
        const connectionString =
          configService.getOrThrow<string>('DB_CONNECTION_STRING');

        const { host, port, username, password, database, encrypt, trustServerCertificate } =
          parseMssqlConnectionString(connectionString);
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
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

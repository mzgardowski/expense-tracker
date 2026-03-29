import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Expense } from './expenses/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '1433', 10),
        username: process.env.DB_USER ?? 'dbadmin',
        password: process.env.DB_PASSWORD ?? 'ZAQ!2wsx',
        database: process.env.DB_NAME ?? 'db-expenses-manager-95964',
        entities: [Expense],
        synchronize: false,
        migrations: [__dirname + '/migrations/*.{js,ts}'],
        migrationsRun: true,
        options: {
          encrypt: true,
          trustServerCertificate: false,
        },
      }),
    }),
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

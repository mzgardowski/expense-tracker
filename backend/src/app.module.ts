import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Expense } from './expenses/entities/expense.entity';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '1433', 10),
      username: process.env.DB_USER ?? 'sa',
      password: process.env.DB_PASSWORD ?? 'StrongPassword123!',
      database: process.env.DB_NAME ?? 'expense_tracker',
      entities: [Expense],
      synchronize: true,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

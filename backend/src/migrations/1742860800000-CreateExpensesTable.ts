import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpensesTable1742860800000 implements MigrationInterface {
  name = 'CreateExpensesTable1742860800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop old table if it exists (handles migration from numeric to UUID ids)
    await queryRunner.query(`
      IF EXISTS (SELECT * FROM sys.tables WHERE name = 'expenses')
        DROP TABLE [expenses]
    `);

    await queryRunner.query(`
      CREATE TABLE [expenses] (
        [id] uniqueidentifier NOT NULL,
        [title] nvarchar(255) NOT NULL,
        [amount] decimal(10,2) NOT NULL,
        [category] nvarchar(50) NOT NULL,
        [date] datetime NOT NULL CONSTRAINT [DF_expenses_date] DEFAULT GETDATE(),
        [budgetId] int,
        [createdAt] datetime NOT NULL CONSTRAINT [DF_expenses_createdAt] DEFAULT GETDATE(),
        [updatedAt] datetime NOT NULL CONSTRAINT [DF_expenses_updatedAt] DEFAULT GETDATE(),
        CONSTRAINT [PK_expenses] PRIMARY KEY ([id])
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      IF EXISTS (SELECT * FROM sys.tables WHERE name = 'expenses')
        DROP TABLE [expenses]
    `);
  }
}

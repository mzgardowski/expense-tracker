import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../enums/expense-category.enum';

@Entity('expenses')
export class Expense {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Groceries', maxLength: 255 })
  @Column({ type: 'nvarchar', length: 255 })
  title: string;

  @ApiProperty({ example: 49.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, example: ExpenseCategory.FOOD })
  @Column({ type: 'nvarchar', length: 50 })
  category: ExpenseCategory;

  @ApiProperty({ example: '2026-03-12T00:00:00.000Z' })
  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  date: Date;

  @ApiProperty({ example: 1, nullable: true })
  @Column({ nullable: true })
  budgetId: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}

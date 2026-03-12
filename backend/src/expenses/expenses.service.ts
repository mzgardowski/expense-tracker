import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      date: createExpenseDto.date
        ? new Date(createExpenseDto.date)
        : new Date(),
    });
    return this.expenseRepository.save(expense);
  }

  async findAll(
    filterDto: FilterExpensesDto,
  ): Promise<PaginatedResult<Expense>> {
    const {
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      category,
      page = 1,
      limit = 10,
    } = filterDto;

    if (
      minAmount !== undefined &&
      maxAmount !== undefined &&
      minAmount > maxAmount
    ) {
      throw new BadRequestException(
        'minAmount cannot be greater than maxAmount',
      );
    }

    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .orderBy('expense.date', 'DESC');

    if (dateFrom) {
      qb.andWhere('expense.date >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      qb.andWhere('expense.date <= :dateTo', { dateTo: to });
    }
    if (minAmount !== undefined) {
      qb.andWhere('expense.amount >= :minAmount', { minAmount });
    }
    if (maxAmount !== undefined) {
      qb.andWhere('expense.amount <= :maxAmount', { maxAmount });
    }
    if (category) {
      qb.andWhere('expense.category = :category', { category });
    }

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id);

    const updated = this.expenseRepository.merge(expense, {
      ...updateExpenseDto,
      ...(updateExpenseDto.date && { date: new Date(updateExpenseDto.date) }),
    });

    return this.expenseRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const expense = await this.findOne(id);
    await this.expenseRepository.remove(expense);
  }
}

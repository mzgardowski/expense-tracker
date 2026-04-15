import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import 'jest';
import { ExpenseCategory } from './enums/expense-category.enum';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repo: Repository<Expense>;

  const mockExpense: Expense = {
    id: '1',
    title: 'Test',
    amount: 100,
    date: new Date(),
    category: ExpenseCategory.FOOD,
    budgetId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    generateId: () => {},
  };

  const expenseArray = [mockExpense];

  const mockRepo = {
    create: jest.fn().mockImplementation((dto: any) => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockExpense),
    findOne: jest.fn().mockResolvedValue(mockExpense),
    remove: jest.fn().mockResolvedValue(undefined),
    merge: jest
      .fn()
      .mockImplementation((entity: any, dto: any) => ({ ...entity, ...dto })),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  } as any;

  const mockQueryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(expenseArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<ExpensesService>(ExpensesService);
    repo = module.get<Repository<Expense>>(getRepositoryToken(Expense));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an expense', async () => {
      const date = new Date().toISOString();
      const dto: CreateExpenseDto = {
        title: 'Test',
        amount: 100,
        date,
        category: ExpenseCategory.FOOD,
      };
      await expect(service.create(dto)).resolves.toEqual(mockExpense);
      // The service converts date string to Date, so match on Date
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dto,
          date: expect.any(Date),
        }),
      );
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const filter: FilterExpensesDto = { page: 1, limit: 10 } as any;
      const result = await service.findAll(filter);
      expect(result.data).toEqual(expenseArray);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
    it('should throw if minAmount > maxAmount', async () => {
      await expect(
        service.findAll({ minAmount: 10, maxAmount: 5 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      await expect(service.findOne('1')).resolves.toEqual(mockExpense);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
    it('should throw if not found', async () => {
      repo.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save an expense', async () => {
      // Ensure repo.findOne returns the mockExpense
      repo.findOne = jest.fn().mockResolvedValue(mockExpense);
      const dto: UpdateExpenseDto = { title: 'Updated' } as any;
      await expect(service.update('1', dto)).resolves.toEqual(mockExpense);
      expect(repo.merge).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      // Ensure repo.findOne returns the mockExpense
      repo.findOne = jest.fn().mockResolvedValue(mockExpense);
      await expect(service.remove('1')).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import 'jest';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';
import { Expense } from './entities/expense.entity';
import { NotFoundException } from '@nestjs/common';
import { ExpenseCategory } from './enums/expense-category.enum';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

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

  const paginatedResult = {
    data: [mockExpense],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockExpense),
    findAll: jest.fn().mockResolvedValue(paginatedResult),
    findOne: jest.fn().mockResolvedValue(mockExpense),
    update: jest.fn().mockResolvedValue(mockExpense),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [{ provide: ExpensesService, useValue: mockService }],
    }).compile();
    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const dto: CreateExpenseDto = {
        title: 'Test',
        amount: 100,
        date: new Date().toISOString(),
        category: ExpenseCategory.FOOD,
      };
      await expect(controller.create(dto)).resolves.toEqual(mockExpense);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const filter: FilterExpensesDto = { page: 1, limit: 10 } as any;
      await expect(controller.findAll(filter)).resolves.toEqual(
        paginatedResult,
      );
      expect(service.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      await expect(controller.findOne('1')).resolves.toEqual(mockExpense);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw if not found', async () => {
      mockService.findOne = jest
        .fn()
        .mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return an expense', async () => {
      const dto: UpdateExpenseDto = { title: 'Updated' } as any;
      await expect(controller.update('1', dto)).resolves.toEqual(mockExpense);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});

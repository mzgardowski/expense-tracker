import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { ExpensesService, PaginatedResult } from './expenses.service';

@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created', type: Expense })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all expenses with optional filters and pagination',
    description:
      'Example: GET /expenses?dateFrom=2026-03-01&dateTo=2026-03-31&minAmount=50&category=FOOD&page=1&limit=10',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of expenses',
  })
  findAll(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filterDto: FilterExpensesDto,
  ): Promise<PaginatedResult<Expense>> {
    return this.expensesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single expense by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Expense found', type: Expense })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Expense> {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing expense' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Expense updated', type: Expense })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Expense deleted' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.expensesService.remove(id);
  }
}

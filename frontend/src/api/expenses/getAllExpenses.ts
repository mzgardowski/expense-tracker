import api from "../apiBase";
import type { ExpenseFilters, PaginatedExpenses } from "../../types/expense";

const getAllExpenses = async (
  filters?: ExpenseFilters,
): Promise<PaginatedExpenses> => {
  const params: Record<string, string | number> = {};

  if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters?.dateTo) params.dateTo = filters.dateTo;
  if (filters?.minAmount !== undefined) params.minAmount = filters.minAmount;
  if (filters?.maxAmount !== undefined) params.maxAmount = filters.maxAmount;
  if (filters?.category) params.category = filters.category;
  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;

  const response = await api.get("/expenses", { params });
  return response.data;
};

export default getAllExpenses;

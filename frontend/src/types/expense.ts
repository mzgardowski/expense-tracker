export const ExpenseCategory = {
  FOOD: "FOOD",
  TRANSPORT: "TRANSPORT",
  ENTERTAINMENT: "ENTERTAINMENT",
  BILLS: "BILLS",
  HEALTH: "HEALTH",
  SHOPPING: "SHOPPING",
  OTHER: "OTHER",
} as const;

export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: "Jedzenie",
  [ExpenseCategory.TRANSPORT]: "Transport",
  [ExpenseCategory.ENTERTAINMENT]: "Rozrywka",
  [ExpenseCategory.BILLS]: "Rachunki",
  [ExpenseCategory.HEALTH]: "Zdrowie",
  [ExpenseCategory.SHOPPING]: "Zakupy",
  [ExpenseCategory.OTHER]: "Inne",
};

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  category?: ExpenseCategory;
  page?: number;
  limit?: number;
}

export interface PaginatedExpenses {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateExpensePayload {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date?: string;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

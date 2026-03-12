import api from "../apiBase";
import type { Expense, UpdateExpensePayload } from "../../types/expense";

const updateExpense = async (
  id: number,
  payload: UpdateExpensePayload,
): Promise<Expense> => {
  const response = await api.put(`/expenses/${id}`, payload);
  return response.data;
};

export default updateExpense;

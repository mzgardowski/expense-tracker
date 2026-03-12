import api from "../apiBase";
import type { CreateExpensePayload, Expense } from "../../types/expense";

const addNewExpense = async (
  payload: CreateExpensePayload,
): Promise<Expense> => {
  const response = await api.post("/expenses", payload);
  return response.data;
};

export default addNewExpense;

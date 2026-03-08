import api from "../apiBase";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

const getAllExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get("/expenses");
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export default getAllExpenses;

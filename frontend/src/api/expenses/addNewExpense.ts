import api from "../apiBase";

const addNewExpense = async (expenseData: {
  amount: number;
  description: string;
  date: string;
}) => {
  try {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  } catch (error) {
    console.error("Error adding new expense:", error);
    throw error;
  }
};

export default addNewExpense;

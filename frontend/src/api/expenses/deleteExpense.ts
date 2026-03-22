import api from "../apiBase";

const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export default deleteExpense;

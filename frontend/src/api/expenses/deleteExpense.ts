import api from "../apiBase";

const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};

export default deleteExpense;

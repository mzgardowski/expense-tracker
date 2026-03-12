import { useState, useEffect } from "react";
import getAllExpenses from "../../api/expenses/getAllExpenses";
import type { Expense } from "../../types/expense";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await getAllExpenses();
        console.log("Fetched expenses:", data);
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h1>Expenses Page</h1>

      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.title}: ${expense.amount} on{" "}
              {new Date(expense.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpensesPage;

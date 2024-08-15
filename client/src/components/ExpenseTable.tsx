import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constant";
import { FaTrash, FaEdit } from "react-icons/fa";
import ExpenseForm from "./ExpenseForm";

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchExpenses = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL + "Expense")
      .then((response) => {
        setExpenses(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses. Please try again.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);


  const handleDelete = (id: number) => {
    axios
      .delete(`${BASE_URL}+"Expense/"+${id}`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
        setError("Failed to delete expense. Please try again.");
      });
  };

  const handleSubmit = (expense: Omit<Expense, "id">) => {
    if (editingExpense) {
      axios
        .put(`${BASE_URL}/${editingExpense.id}`, expense)
        .then((response) => {
          setExpenses(
            expenses.map((e) =>
              e.id === editingExpense.id ? response.data : e
            )
          );
          setIsFormOpen(false);
          setEditingExpense(null);
        })
        .catch((error) => {
          console.error("Error updating expense:", error);
          setError("Failed to update expense. Please try again.");
        });
    } else {
      axios
        .post(BASE_URL, expense)
        .then((response) => {
          setExpenses([...expenses, response.data]);
          setIsFormOpen(false);
        })
        .catch((error) => {
          console.error("Error adding expense:", error);
          setError("Failed to add expense. Please try again.");
        });
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Expense Tracker</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsFormOpen(true)}
      >
        Add Expense
      </button>

      {isFormOpen && (
        <ExpenseForm
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingExpense(null);
          }}
          expense={editingExpense}
        />
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{expense.category}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(expense)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseTable;
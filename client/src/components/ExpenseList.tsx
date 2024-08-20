import { useState } from 'react';
import { Expense } from '../App';
import axios from "axios";
import { BASE_URL } from "../constant";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  fetchData: () => void;
  category: string;
}

const ExpenseList = ({ expenses, onDelete, fetchData, }:
  ExpenseListProps ) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    // const [editExpense, setEditExpense] = useState<number | null>(null);
    const [currentExpense, setCurrentExpense] = useState<Expense>({
      id: 0,
      description: "",
      amount: 0,
      category: "",
    });
  // Handle delete button click
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
    }
  };

  // Render loading state
  if (expenses.length === 0) {
    return (
      <div className="text-center">
        <p>No expenses found.</p>
      </div>
    );
  }

  const startEditing = (id: number) => {
    setEditingId(id);
    const foundExpense = expenses.find((expense) => expense.id === id);
    if (foundExpense) {
      setCurrentExpense({ ...foundExpense });
    }
  };

  const stopEditing = () => {
    setEditingId(null);
    setCurrentExpense({
      id: 0,
      description: "",
      amount: 0,
      category: "",
    });
  };

  const saveExpense = (id: number) => {
    if (currentExpense) {
      axios
        .put(`${BASE_URL}${id}`, currentExpense)
        .then(() => {
          fetchData();
        })
        .catch((error) => console.log(error.message));
    }
    stopEditing();
  };


  return (
    <>
      <div className="container">
        <div className="table-responsive">
          <table className="table table-bordered border-success">
            <thead>
              <tr>
                <th scope="col" className="tableHeadFoot">Description</th>
                <th scope="col" className="tableHeadFoot">Amount</th>
                <th scope="col" className="tableHeadFoot">Category</th>
                <th scope="col" className="tableHeadFoot">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                editingId === expense.id ? (
                <tr key={expense.id}>
                 <td>
                  <input
                    type="text"
                    value={currentExpense.description}
                    onChange={(e) =>
                      setCurrentExpense({ ...currentExpense, description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={currentExpense.amount}
                    onChange={(e) =>
                      setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={currentExpense.category}
                    onChange={(e) =>
                      setCurrentExpense({ ...currentExpense, category: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button className="btn btn-outline" id="button" onClick={() => saveExpense(expense.id)}>
                    Update
                  </button>
                  <button className="btn btn-outline" id="button" onClick={stopEditing}>
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>
                  <button className="btn btn-outline" id="button" onClick={() => startEditing(expense.id)}>
                    Edit
                  </button>
                    <button
                      className="btn btn-outline-danger" id="button"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
            </tbody>
            <tfoot>
              <tr>
                <td className="tableHeadFoot">Total Expenses</td>
                <td className="tableHeadFoot">
                  $
                  {expenses
                    .reduce(
                      (total, expense) => total + parseInt(expense.amount),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="tableHeadFoot"></td>
                <td className="tableHeadFoot"></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </>
  );
};

export default ExpenseList;
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constant';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  onUpdate: () => void; // New prop for updating the expenses list
}

const ExpenseList = ({ expenses, onDelete, onUpdate }: ExpenseListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);

  if (expenses.length === 0) return null;

  const onEdit = (id: number) => {
    setEditingId(id);
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setEditedExpense({ ...expenseToEdit });
    }
  };

  const onSave = (id: number) => {
    if (editedExpense) {
      axios
        .put(`${BASE_URL}/api/Expense${id}`, editedExpense)
        .then(() => {
          setEditingId(null);
          setEditedExpense(null);
          onUpdate(); // Call the onUpdate function to refetch or update the expenses list
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedExpense) {
      setEditedExpense({
        ...editedExpense,
        [e.target.name]: e.target.value,
      });
    }
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
                <tr key={expense.id}>
                  <td>
                    {editingId === expense.id ? (
                      <input
                        type="text"
                        name="description"
                        value={editedExpense?.description || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      expense.description
                    )}
                  </td>
                  <td>
                    {editingId === expense.id ? (
                      <input
                        type="number"
                        name="amount"
                        value={editedExpense?.amount || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `$${expense.amount}`
                    )}
                  </td>
                  <td>
                    {editingId === expense.id ? (
                      <select
                        name="category"
                        value={editedExpense?.category || ''}
                        onChange={handleInputChange}
                      >
                        <option value="Groceries">Groceries</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                        <option value="Shopping">Shopping</option>
                      </select>
                    ) : (
                      expense.category
                    )}
                  </td>
                  <td>
                    {editingId === expense.id ? (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => onSave(expense.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => onDelete(expense.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-warning ms-2"
                          onClick={() => onEdit(expense.id)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="tableHeadFoot">Total Expenses</td>
                <td className="tableHeadFoot">
                  $
                  {expenses
                    .reduce(
                      (total, expense) => total + (expense.amount),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="tableHeadFoot"></td>
                <td className="tableHeadFoot"></td>
              </tr>
            </tfoot>
          </table>
          {
            expenses.length == 0 && <header> No DATA </header>
          }
        </div>
      </div>
    </>
  );
};

export default ExpenseList;
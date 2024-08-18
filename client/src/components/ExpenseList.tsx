import React from 'react';
import { Expense } from '../App';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  fetchData: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, fetchData }) => {
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
                <th scope="col" className="tableHeadFoot"></th>
                <th>Action</th>
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
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
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
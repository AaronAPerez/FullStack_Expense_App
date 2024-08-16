import { useState } from 'react';
import axios, { CanceledError } from 'axios';
import { BASE_URL } from '../constant';
import { Expense } from '../App';

interface ExpenseProps {
  expenses: Expense[];
  setExpenseArray: React.Dispatch<React.SetStateAction<Expense[]>>;
  category: string;
  fetchData: () => void;
}

const ExpenseList = ({ expenses, setExpenseArray, category, fetchData }: ExpenseProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedExpense, setEditedExpense] = useState<Expense | null>(null);


  const onDelete = (id: number) => {
    axios
      .delete(`${BASE_URL}`)
      .then(() => {
        setExpenseArray(expenses.filter((expense) => expense.id !== id));
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onEdit = (id: number) => {
    setEditingId(id);
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    if (expenseToEdit) {
      setEditedExpense({ ...expenseToEdit });
    }
  };

  const onSave = (id: number) => {
    if (editedExpense?.id) {
      axios
      .put(`${BASE_URL}/Expense`)
        .then(() => {
          setExpenseArray(expenses.map(expense =>
            expense.id === id ? editedExpense : expense
          ));
          setEditingId(null);
          setEditedExpense(null);
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
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Amount</th>
            <th scope="col">Category</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {category === "All"
            ? expenses.map((expense: Expense) => (
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
                      type="text"
                      name="amount"
                      value={editedExpense?.amount || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    expense.amount
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
                      <option value="Utils">Utils</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Food">Food</option>
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
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(expense.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => onEdit(expense.id)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
            : expenses
              .filter((expense) => expense.category === category)
              .map((expense) => (
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
                        type="text"
                        name="amount"
                        value={editedExpense?.amount || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      expense.amount
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
                        <option value="Utils">Utils</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Food">Food</option>
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
                          className="btn btn-outline-danger"
                          onClick={() => onDelete(expense.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-warning"
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
            <td>Total</td>
            <td>$
              {expenses
                .reduce((acc, expense) => {
                  // Ensure expense.amount is a number
                  const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0;
                  return acc + amount;
                }, 0)
                .toFixed(2)}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>

      </table>
    </>
  );
};

export default ExpenseList;


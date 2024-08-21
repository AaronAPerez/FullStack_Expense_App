
import { useState } from "react";
import { Expense } from "../App";
import axios from "axios";
import { BASE_URL } from "../constant";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";


interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  fetchData: () => void;
  category: string;
}


// ExpenseList component for displaying the list of expenses
const ExpenseList = ({
  expenses,
  onDelete,
  fetchData,
}: ExpenseListProps) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [currentExpense, setCurrentExpense] = useState<Expense>({
    id: 0,
    description: "",
    amount: 0,
    category: "",
  });

  

  const startEdit = (id: number) => {
    setEditId(id);
    const foundExpense = expenses.find((expense) => expense.id === id);
    if (foundExpense) {
      setCurrentExpense({ ...foundExpense });
    }
  };

  const stopEdit = () => {
    setEditId(null);
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
    stopEdit();
  };

  const handleDelete= (id: number) => {
    axios
      .delete(`${BASE_URL}${id}`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
        fetchData();
      })
      .catch(error => {
        console.log(error);
        setError('Error deleting expense');
      });
  };



  // Render loading state if no expenses
  if (expenses.length === 0) {
    return (
      <div className="text-center">
        <p>No expenses found.</p>
      </div>
    );
  }

  // Render the expense list table
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
              {expenses.map((expense) => 
                editId === expense.id ? (
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
                      <button className="btn btn-outline" id="button" onClick={stopEdit}>
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
                      <button
                        className="btn btn-outline-success" title="Edit Expense"
                        
                        onClick={() => startEdit(expense.id)}
                      >
                     <FaEdit size={35} />
                      </button>
                      <button className="btn btn-outline-danger" id="button"  title="Delete Expense" onClick={() => onDelete(expense.id)}>
                      <FaRegTrashCan color="red" size={25} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              {/* Calculate and display total expenses */}
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
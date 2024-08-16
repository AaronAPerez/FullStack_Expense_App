
import axios from "axios";
import { useState } from "react";
import categories from "../categories";
import { BASE_URL } from "../constant";
import { Expense } from "../App";


interface ExpenseFormProps {
  fetchData: () => void;
  currentData?: Expense

}

export const ExpenseForm = ({ fetchData, currentData }: ExpenseFormProps) => {
  const [expense, setExpense] = useState({
    id: currentData?.id || 0,
    description: currentData?.description || '',
    amount: currentData?.amount || '',
    category: currentData?.category || ''
  })

  const addExpense = () => {
    axios
    .post(`${BASE_URL}/api/Expense`)
      .then(response => {
        console.log(response);
        fetchData();
      })
      .catch(error => {
        console.log(error);
      })
  }


  return (

    <form>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          id="description"
          type="text"
          className="form-control"
          value={expense.description}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          id="amount"
          type="number"
          className="form-control"
          value={expense.amount}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
          id="category"
          className="form-select"
          value={expense.category}
        >
          <option value=""></option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={addExpense}
        type="button"
        className="btn btn-outline-primary"
      >
        Submit
      </button>
    </form>
  );
};

export default ExpenseForm;
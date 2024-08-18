import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../constant';
import { Expense } from './ExpenseList';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for form validation
const schema = z.object({
  description: z
  .string()
  .min(1, { message: "Required field - Enter at least one character" }),
  amount: z
  .preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z.number({ invalid_type_error: "Required Field - Amount must be a number" })
      .positive({ message: "Amount must be positive" })
  ),
  category: z
  .string()
  .refine((val) => val !== "", { message: "Required Field - Select a Category" }),
});

type FormData = z.infer<typeof schema>;

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  fetchData: () => void;
  currentData?: Expense;
}

const ExpenseForm = ({ onSubmit, fetchData, currentData }: ExpenseFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: currentData?.description || '',
      amount: currentData?.amount || undefined,
      category: currentData?.category || '',
    },
  });

  const submitHandler: SubmitHandler<FormData> = (data) => {
    if (currentData?.id) {
      editExpense(data);
    } else {
      addExpense(data);
    }
  };

  const editExpense = (data: FormData) => {
    axios.put(`${BASE_URL}/Expense/${currentData?.id}`, data)
      .then(() => {
        fetchData();
        reset();
        alert('Expense updated successfully');
      })
      .catch((error) => {
        console.error('Error updating expense:', error);
        alert('Error updating expense');
      });
  };

  const addExpense = (data: FormData) => {
    axios.post(BASE_URL + "Expense", data)
      .then((response) => {
        onSubmit(response.data);
        fetchData();
        reset();
        alert('Expense added successfully');
      })
      .catch((error) => {
        console.error('Error adding expense:', error);
        alert('Error adding expense');
      });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input
          {...register("description")}
          type="text"
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
        />
        {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">Amount</label>
        <input
          {...register("amount", { valueAsNumber: true })}
          type="number"
          className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
          id="amount"
        />
        {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          {...register("category")}
          className={`form-select ${errors.category ? 'is-invalid' : ''}`}
          id="category"
        >
          <option value="">Select category</option>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          {/* Add more categories as needed */}
        </select>
        {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
      </div>
      <button type="submit" className="btn btn-success">
        {currentData?.id ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../constant';
import { Expense } from './ExpenseList';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import categories from '../categories';

// Zod schema for form validation
const schema = z
  .object({
    id: z.number().default(0),
    description: z.string()
      .min(1, { message: "Required field - Enter at least one character" }),
    amount:
      z.preprocess(
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
  // onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onSubmit: (expense: Expense) => void;
  fetchData: () => void;
  currentExpense?: Expense;
}

// ExpenseForm component for adding and editing expenses
const ExpenseForm = ({ fetchData, currentExpense }: ExpenseFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: currentExpense?.id || 0,
      description: currentExpense?.description || '',
      amount: currentExpense?.amount || '',
      category: currentExpense?.category || '',
    },
  });

  const submitHandler: SubmitHandler<FormData> = (data) => {
    if (currentExpense) {
      editExpense(data);
    } else {
      addExpense(data);
    }
  };

  const addExpense = (data: FormData) => {
    axios
    .post(`${BASE_URL}`, data)
    .then((response) => {
      submitHandler(response.data);
      console.log(response);
      alert('Expense added successfully');
      fetchData();
      reset();
    })
    .catch((error) =>
      console.log(error));
      alert('Error adding expense');
  
};

    const editExpense = (data: FormData) => {
      axios
        .put(`${BASE_URL}${currentExpense.id}`, data)
        .then((response) => {
          submitHandler(response.data);
          console.log(response);
          alert('Expense updated successfully');
          fetchData();
          reset();
        })
        .catch((error) =>
          console.log(error));
      alert('Error updating expense');

  
};
     
  // Render the expense form
  return (
    <>
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
            id="amount"
            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}

          />
          {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            {...register("category")}
            id="category"
            >
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
          
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
        </div>
        <button className="btn btn-success" id="submitButton">
          {currentExpense?.id ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </>
  );
};

export default ExpenseForm;
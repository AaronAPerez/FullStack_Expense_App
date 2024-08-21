import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../constant';
import { Expense } from './ExpenseList';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import categories from '../categories';
import { MdFormatListBulletedAdd } from "react-icons/md";

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
        fetchData();
        reset();
        alert('Expense added successfully');
      })
      .catch((error) => {
        console.error('Error adding expense:', error);
      })
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
    <div className="container">
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="my-3">
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
          <label htmlFor="category" className="form-label"></label>
          <select
            {...register("category")}
            id="category"
            className="form-select"
             >
            <option value="">Select Category</option>
            {/* // Map callback function to pass in category */}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
              <p className="text-danger">{errors.category.message}</p>
            )}
        </div>
        <div className="wrapper">
          <div className="link_wrapper">
            <button className="btn btn-success" id="submitButton">
              {currentExpense?.id ? 'Update Expense' : 'Add Expense'}
              <MdFormatListBulletedAdd size={25} id="addIcon" />
            </button>
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 268.832 268.832"
              >
                <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
              </svg>
            </div>
          </div>
        </div>
      </form>
      </div>
    </>
  );
};

export default ExpenseForm;
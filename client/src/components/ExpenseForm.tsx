import axios from 'axios';
import { BASE_URL } from '../constant';
import { Expense } from '../App';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import categories from '../categories';

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

// ExpenseForm component for adding and editing expenses
const ExpenseForm = ({ onSubmit, fetchData, currentData }: ExpenseFormProps) => {
  // Initialize react-hook-form with zod resolver for validation
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

  // Handle form submission
  const submitHandler: SubmitHandler<FormData> = (data) => {
    if (currentData?.id) {
      editExpense(data);
    } else {
      addExpense(data);
    }
  };

  // Function to edit an existing expense
  const editExpense = (data: FormData) => {
    axios.put(`${BASE_URL}Edit/${currentData?.id}`, data)
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

  // Function to add a new expense
  const addExpense = (data: FormData) => {
    axios.post(`${BASE_URL}AddExpense`, data)
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

  // Render the expense form
  return (
    <>
    <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            {...register("description")}
            type="text"
            id="description"
            className="form-control" onChange={(e) =>
              setInputData({ ...inputData, description: e.target.value })
            }
          />
           {errors.description && (
            <p className="text-danger">{errors.description.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            id="amount"
            className="form-control" onChange={(e) => setInputData({...inputData, amount: parseInt(e.target.value)})}
            />
              
              ${errors.amount  && (
                <p className="text-danger">{errors.amount.message}</p>
              )}
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            {...register("category")}
             id="category"
            className="form-select"      
            onChange={(e) => setInputData({...inputData, category: e.target.value})}
          >
            <option>Select a Category</option>
            {/* this map makes the options show in the select category field  notice the callback function */}
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {/* error for category shows below the select field */}
          {errors.category && (
            <p className="text-danger">{errors.category.message}</p>
          )}
        </div>
 
        <button type="submit" className="btn btn-success">Save</button>
        <button type="submit" className="btn btn-success">
        {currentData?.id ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
    </>
  );
};

export default ExpenseForm;
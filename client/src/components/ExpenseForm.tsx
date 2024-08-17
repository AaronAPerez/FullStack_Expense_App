import axios from "axios";
import { useState } from "react";
import categories from "../categories";
import { BASE_URL } from "../constant";
import { Expense } from "../App";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { MdFormatListBulletedAdd } from "react-icons/md";

// Zod schema for form validation
const schema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1, { message: "Required field - Enter at least one character" }),
    amount: z.preprocess(
      (value) => (typeof value === "string" ? parseFloat(value) : value),
      z
        .number({ message: "Required Field - Amount must be a number" })
        .positive({ message: "Amount must be positive" })
        .refine((value) => !isNaN(value), { message: "Enter a valid number" })
    ),
    category: z.string(),
  })
  .refine((data) => data.category !== "Select a Category", {
    message: "Required Field - Select a Category from drop down options",
    path: ["category"],
  });

type FormData = z.infer<typeof schema>;

export interface ExpenseFormProps {
  onSubmit: (data: FormData) => void;
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
      id: currentData?.id || '',
      description: currentData?.description || '',
      amount: currentData?.amount || '',
      category: currentData?.category || ''
    }
  });

const submitHandler: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
    reset();
    
    axios
      .post(`${BASE_URL}/api/Expense`)
      .then(response => {
        console.log(response);
        fetchData();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          {...register("description")}
          id="description"
          type="text"
          className="form-control"
        />
        {errors.description && (
          <p className="text-danger">{errors.description.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          {...register("amount", { valueAsNumber: true })}
          id="amount"
          type="number"
          className="form-control"
        />
        {errors.amount && (
          <p className="text-danger">{errors.amount.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          {...register("category")}
          id="category"
          className="form-select"
        >
          <option value="">Select a Category</option>
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
      <button type="submit" className="btn btn-success">
        Add Expense <MdFormatListBulletedAdd size={25} id="addIcon" />
      </button>
    </form>
    </>
  );
};

export default ExpenseForm;
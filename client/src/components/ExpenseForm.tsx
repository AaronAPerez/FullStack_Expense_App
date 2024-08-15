import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import categories from "../categories";

const schema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.number({ required_error: "Amount is required" }).min(0.01, { message: "Amount must be greater than 0" }),
  category: z.string().refine((val) => val !== "Select a Category", {
    message: "Please select a category",
  }),
});

type FormData = z.infer<typeof schema>;

interface ExpenseFormProps {
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  expense?: FormData | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onClose, expense }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: expense || undefined,
  });

  const onSubmitHandler = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="mb-3">
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input
          {...register("description")}
          id="description"
          type="text"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
        />
        {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="amount" className="form-label">Amount</label>
        <input
          {...register("amount", { valueAsNumber: true })}
          id="amount"
          type="number"
          step="0.01"
          className={`form-control ${errors.amount ? "is-invalid" : ""}`}
        />
        {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          {...register("category")}
          id="category"
          className={`form-select ${errors.category ? "is-invalid" : ""}`}
        >
          <option value="Select a Category">Select a Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
      </div>

      <button type="submit" className="btn btn-primary me-2">
        {expense ? "Update" : "Add"} Expense
      </button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default ExpenseForm;
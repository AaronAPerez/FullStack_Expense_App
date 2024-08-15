import { Select, Box } from "@chakra-ui/react";
import categories from "../categories";
import React from "react";

interface ExpenseFilterProps {
  onSelectCategory: (category: string) => void;
}

const ExpenseFilter = ({ onSelectCategory }: ExpenseFilterProps) => {
  return (
    <Box mb={4}>
      <Select
        placeholder="Filter by Category"
        onChange={(event) => onSelectCategory(event.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default ExpenseFilter;
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Box, Text, Spinner } from "@chakra-ui/react";
import React from "react";
import { FaTrash } from "react-icons/fa";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  isLoading: boolean;
  error: string;
}

const ExpenseList = ({ expenses, onDelete, isLoading, error }: ExpenseListProps) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" color="red.500">
        <Text>{error}</Text>
      </Box>
    );
  }

  if (expenses.length === 0) {
    return (
      <Box textAlign="center">
        <Text>No expenses found.</Text>
      </Box>
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Description</Th>
          <Th>Amount</Th>
          <Th>Category</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {expenses.map((expense) => (
          <Tr key={expense.id}>
            <Td>{expense.description}</Td>
            <Td>${expense.amount.toFixed(2)}</Td>
            <Td>{expense.category}</Td>
            <Td>
              <IconButton
                aria-label="Delete expense"
                icon={<FaTrash />}
                onClick={() => onDelete(expense.id)}
                colorScheme="red"
                size="sm"
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ExpenseList;
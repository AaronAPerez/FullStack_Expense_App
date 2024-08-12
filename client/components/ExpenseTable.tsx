import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../src/constant";
import React from "react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

const ExpenseTable = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box m={32} shadow={"md"} rounded={"md"}>
        <Flex justifyContent={"space-between"} px={"5"}>
          <Heading>Expense List</Heading>
          <Button color="cyan.300" leftIcon={<AddIcon />}>
            Add Expense
          </Button>
        </Flex>

        <TableContainer>
          <Table variant="striped" colorScheme="cyan">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Description</Th>
                <Th>Amount</Th>
                <Th>Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((expense) => (
                <Tr key={expense.id}>
                  <Td>{expense.id}</Td>
                  <Td>{expense.description}</Td>
                  <Td>{expense.amount}</Td>
                  <Td>{expense.category}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ExpenseTable;
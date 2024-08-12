import { useState, useEffect } from "react";
import ExpenseFilter from "../components/ExpenseFilter";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { FaPiggyBank } from "react-icons/fa";
import { ChakraProvider, Box, Heading, Flex } from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "./constant";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = () => {
    setIsLoading(true);
    axios
      .get<Expense[]>(BASE_URL)
      .then((response) => {
        setExpenses(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching expenses");
        setIsLoading(false);
        console.error(error);
      });
  };

  const visibleExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  const handleDelete = (id: number) => {
    axios
      .delete(`${BASE_URL}/${id}`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  };

  const handleSubmit = (expense: Omit<Expense, "id">) => {
    axios
      .post<Expense>(BASE_URL, expense)
      .then((response) => {
        setExpenses([...expenses, response.data]);
        setIsFormOpen(false);
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      });
  };

  return (
    <>
     <div className="container">
        <header className="py-2 border-bottom">
          <h1 className="text-center">
            EXPENSE TR
            <FaPiggyBank size={59} color="pink" />
            CKER
          </h1>
        </header>
        <div className="main">
          <div className="row">
            <div className="col-md-4">
              {/* <h2 className="text-center">New Expense</h2> */}
              <ExpenseForm
                onSubmit={(expense) =>
                  setExpenses([
                    ...expenses,
                    { ...expense, id: expenses.length + 1 },
                  ])
                }
              />
            </div>
            <div className="col-md-8 pt-2">
              <ExpenseFilter
                visibleExpense={(category) => setSelectedCategory(category)}
              />
              <ExpenseList expenses={visibleExpenses} onDelete={handleDelete} isLoading={false} error={""} />
            </div>
          </div>
        </div>
      </div>
    {/* <ChakraProvider>
      <Box maxWidth="1200px" margin="auto" padding={4}>
        <Flex justifyContent="center" alignItems="center" marginBottom={4}>
          <FaPiggyBank size={40} color="pink" />
          <Heading as="h1" marginLeft={2}>
            EXPENSE TRACKER
          </Heading>
        </Flex>
        <Flex>
          <Box width="30%" paddingRight={4}>
            <ExpenseForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              {...handleSubmit}
              // onSubmit={handleSubmit}
              fetchExpense={fetchExpenses}
            />
          </Box>
          <Box width="70%">
            <ExpenseFilter
              onSelectCategory={(category) => setSelectedCategory(category)}
            />
            <ExpenseList
              expenses={visibleExpenses}
              onDelete={handleDelete}
              isLoading={isLoading}
              error={error}
            />
          </Box>
        </Flex>
      </Box>
    </ChakraProvider> */}
    </>
  );
};

export default App;
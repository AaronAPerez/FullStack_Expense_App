import { useState, useEffect } from "react";
import ExpenseFilter from "./components/ExpenseFilter";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { FaPiggyBank } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "./constant";

// Define the Expense interface to be used across components
export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

// Main App component
const App = () => {
  // State for managing expenses and UI
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentData, setCurrentData] = useState<Expense | undefined>(undefined);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch expenses from the API
  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}GetExpenses/`)
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.log(error);
        setError('Error fetching expenses');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Fetch expenses when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Filter expenses based on selected category
  const visibleExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  // Handle expense deletion
  const handleDelete = (id: number) => {
    axios
      .delete(`${BASE_URL}Delete/${id}`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch(error => {
        console.log(error);
        setError('Error deleting expense');
      });
  };

  // Handle expense submission (add new expense)
  const handleSubmit = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: expenses.length + 1 }]);
  };

  // Render the main application structure
  return (
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
            {/* ExpenseForm component for adding/editing expenses */}
            <ExpenseForm onSubmit={handleSubmit} fetchData={fetchData} currentData={currentData} />
          </div>
          <div className="col-md-8 pt-2">
            {/* ExpenseFilter component for filtering expenses by category */}
            <ExpenseFilter
              onSelectCategory={(category) => setSelectedCategory(category)}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            {/* ExpenseList component for displaying the list of expenses */}
            <ExpenseList
              expenses={visibleExpenses} 
              fetchData={fetchData}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
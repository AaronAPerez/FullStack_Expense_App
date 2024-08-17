import { useState, useEffect } from "react";
import ExpenseFilter from "./components/ExpenseFilter";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { FaPiggyBank } from "react-icons/fa";
import axios, { CanceledError } from "axios";
import { BASE_URL } from "./constant";
import { Expense } from './components/ExpenseList';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentData, setCurrentData] = useState<Expense>({} as Expense);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);



  const fetchData = (id:number) => {
    setIsLoading(true);
    axios
      .get<Expense>(`${BASE_URL}/api/Expense` + id)
      .then(response => {
        setCurrentData(response.data)
        console.log((response))
        // setExpenses(response.data);
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  



  const visibleExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses;

  const handleDelete = (id: number) => {
    axios
      .delete(`${BASE_URL}/api/Expense`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSubmit = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: expenses.length + 1 }]);
  };

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
            <ExpenseForm onSubmit={handleSubmit} fetchData={fetchData} />
          </div>
          <div className="col-md-8 pt-2">
            <ExpenseFilter
              onSelectCategory={(category) => setSelectedCategory(category)}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-danger">Error: {error}</p>}
            <ExpenseList
            expenses={visibleExpenses} 
            fetchData={fetchData}
            onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilter from "./components/ExpenseFilter";
import ExpenseList from "./components/ExpenseList";
import categories from "./categories";
import { BASE_URL } from "./constant";
import axios, { CanceledError } from "axios";

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
};

const App = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () =>{
    axios
    .get(`${BASE_URL} + "Expense"`)
    .then(response => {
        setData(response.data);
    })
    .catch(error => {
        if(error instanceof CanceledError){
            return
        }
        setError(error.message);
        // console.log("error debug: "+ error);

    }).finally(()=>{
        setIsLoading(false);
    })
    // console.log("Data debug: "+ data);
}

  return (
    <>
      <h1 className="text-center">Expense Tracker</h1>
      <div className="container">
        <div className="mb-5">
          <ExpenseForm
            fetchData={fetchData}
          />
        </div>

        <div className="m-5">
          <ExpenseFilter
            onSelectCategory={(category) => setSelectedCategory(category)}
          />
        </div>
        <div className="m-5">
          <ExpenseList
            category={selectedCategory}
            setExpenseArray={setData}
            expenses={data}
            fetchData={fetchData}
          />
        </div>
      </div>

    </>
  );
};

export default App;





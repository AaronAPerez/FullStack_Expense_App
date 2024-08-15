import { ChakraProvider } from '@chakra-ui/react';
import ExpenseTable from './components/ExpenseTable';

const App = () => {

  
  return (
    <>
      <ChakraProvider>
        <ExpenseTable />
      </ChakraProvider>
    </>
  );
};

export default App;


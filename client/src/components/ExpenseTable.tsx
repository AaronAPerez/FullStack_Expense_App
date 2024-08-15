import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Badge,
  useDisclosure,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverFooter,
  useToast,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constant";
import ExpenseForm from "./ExpenseForm";
import ViewDetails from "./ViewDetails";
import ExpenseSkeleton from "./ExpenseSkeleton";

export interface Expense {
  id: number;
  name: string;
  price: string;
  description: string;
  isInStore: boolean;
}

const ExpenseTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen:viewDialogOpen, onOpen:onViewDialogOpen, onClose:onviewDialogClose} = useDisclosure()
  //UseStates
  const [currentData, setCurrentData] = useState<Expense>({} as Expense);
  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  //function to help us fetch our data with axios, handle our error

  const toast = useToast();
  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL + "Expense")
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

  const getExpense = (id: number) => {
    axios
      .get(BASE_URL + "Expense/" + id)
      .then((response) => {
        setCurrentData(response.data);
        
        onOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading) return <ExpenseSkeleton />;

  const handleAdd = () => {
    onOpen();
    setCurrentData({} as Expense);
  };


    const handleDelete = (id:number) => {
      axios.delete(BASE_URL+'Expense/'+id)
      .then(() => {
        toast({
          title: "Expense Deleted.",
          description: "Expense Deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchData();
      }).catch(error => {
        console.log(error);
        
      })
    }

    const handleViewDetail = (id:number) => {
      axios.get<Expense>(BASE_URL+"Expense/"+id)
      .then(response => {
        setCurrentData(response.data)
        onViewDialogOpen()
      }).catch(error => {
        console.log(error);
        
      })
    }

  return (
    <>
      <ColorModeSwitch />
      <Box m={32} shadow={"md"} rounded={"md"}>
        <Flex justifyContent={"space-between"} px={"5"}>
          <Heading fontSize={25}>Expense List</Heading>
          <Button
            onClick={() => handleAdd()}
            color="teal.300"
            leftIcon={<AddIcon />}
          >
            {" "}
            Add Expense
          </Button>
        </Flex>

        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Id</Th>
                {/* <Th>Name</Th> */}
                <Th>Description</Th>
                {/* <Th>Is In Stock</Th> */}
                <Th isNumeric>Amount</Th>
                <Th>Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((expense: Expense) => (
                <Tr key={expense.id}>
                  <Td>{expense.id}</Td>
                  <Td>
                    <HStack>
                      <Avatar size={"sm"} description={expense.description} />
                      <Text>{expense.description}</Text>
                    </HStack>
                  </Td>

                  {/* <Td>{expense.description}</Td> */}
                  {/* <Td>
                    <Badge>{expense.isInStore ? "Yes" : "No"}</Badge>
                  </Td> */}
                  <Td>{expense.amount}</Td>
                  {/* <Td>{expense.price}</Td> */}
                  <Td>{expense.category}</Td>
                  <Td>
                    <HStack>
                      <EditIcon
                        onClick={() => getExpense(expense.id)}
                        boxSize={23}
                        color={"orange.200"}
                      />
                      <Popover>
                        <PopoverTrigger>
                      <DeleteIcon boxSize={23} color={"red.400"} />
                        
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Confirmation!</PopoverHeader>
                          <PopoverBody>
                            Are you sure you want to Delete?
                          </PopoverBody>
                          <PopoverFooter>
                            <Button colorScheme="red" variant={"outline"} onClick={() => handleDelete(expense.id)}>Delete</Button>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                      <ViewIcon onClick={() => handleViewDetail(expense.id)} boxSize={23} color={"green.300"} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {data.length == 0 && (
          <Heading p={5} textAlign={"center"} fontSize={24}>
            No Data
          </Heading>
        )}
        {isOpen && (
          <ExpenseForm
            currentData={currentData}
            fetchExpense={fetchData}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}

        {viewDialogOpen && <ViewDetails isOpen={viewDialogOpen} onClose={onviewDialogClose} currentData={currentData}/>}
      </Box>
    </>
  );
};

export default ExpenseTable;

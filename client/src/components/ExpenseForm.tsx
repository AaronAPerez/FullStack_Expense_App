import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Input,
  Textarea,
  Text,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BASE_URL } from '../constant';
import axios from "axios";
import { Expense } from "./ExpenseTable";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchExpense: () => void;
  currentData?: Expense;
}

const ExpenseForm = ({
  isOpen,
  onClose,
  fetchExpense,
  currentData,
}: ExpenseFormProps) => {

  const toast = useToast();

  const [expense, setExpense] = useState({
    id:currentData?.id || 0,
    name:currentData?.name || "",
    description:currentData?.description || "",
    amount:currentData?.price || "",
    category:currentData?.category || "",
  });

  const onSave = () => {
    if (currentData?.id) {
      editExpense();
    } else {
      addExpense();
    }
  };

  
  const editExpense = () => {
    axios
      .put(BASE_URL + "/" + currentData?.id, expense)
      .then(() => {
        onClose();
        fetchExpense();
        toast({
          title: "Expense Updated.",
          description: "Expense updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addExpense = () => {
    axios
      .post(BASE_URL + "Expense", expense)
      .then((response) => {
        onClose();
        fetchExpense();
        toast({
          title: "Expense Added.",
          description: "Expense Added Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(expense);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={3} alignItems={"self-start"}>
              <Input
                type="text"
                placeholder="Description"
                value={expense.description}
                onChange={(e) =>
                  setExpense({ ...expense, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) =>
                  setExpense({...expense, amount:(e.target.value)})
                }
              />
                   
              <Textarea
                placeholder="category"
                value={expense.category}
                onChange={(e) =>
                  setExpense({ ...expense, category: e.target.value })
                }
              />
    
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onSave} colorScheme="teal">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExpenseForm;



import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { BASE_URL } from "../src/constant";
import axios from "axios";

const schema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1, { message: "Required field - Enter at least one character" }),
    amount: z.number({ message: "Required field - Enter at least one number" }),
    category: z.string(),
  })
  .refine((data) => data.category !== "Select a Category", {
    message: "Required Field - Select a Category from drop down options",
    path: ["category"],
  });

type FormData = z.infer<typeof schema>;

export interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchExpense: () => void;
  currentData?: FormData;
}

const ExpenseForm = ({
  isOpen,
  onClose,
  fetchExpense,
  currentData,
}: ExpenseFormProps) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: currentData,
  });

  const onSubmit = (data: FormData) => {
    if (currentData) {
      editExpense(data);
    } else {
      addExpense(data);
    }
  };

  const editExpense = (data: FormData) => {
    axios
      .put(`${BASE_URL}/${currentData}`, data)
      // .put(`${BASE_URL}/${currentData?.id}`, data)
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
        toast({
          title: "Error",
          description: "Failed to update expense.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const addExpense = (data: FormData) => {
    axios
      .post(`${BASE_URL}/Expense`, data)
      .then(() => {
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
        toast({
          title: "Error",
          description: "Failed to add expense.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{currentData ? "Edit Expense" : "Add Expense"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Input
                  {...register("description")}
                  placeholder="Enter description"
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.amount}>
                <FormLabel>Amount</FormLabel>
                <Input
                  {...register("amount", { valueAsNumber: true })}
                  type="number"
                  placeholder="Enter amount"
                />
                <FormErrorMessage>
                  {errors.amount && errors.amount.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.category}>
                <FormLabel>Category</FormLabel>
                <Select {...register("category")} placeholder="Select a Category">
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </Select>
                <FormErrorMessage>
                  {errors.category && errors.category.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" type="submit">
              {currentData ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ExpenseForm;
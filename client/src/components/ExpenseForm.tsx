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
    price:currentData?.price || "",
    isInStore:currentData?.isInStore || false,
  });

  const onSave = () => {
    axios.post(BASE_URL+"Expense", expense).then(response => {
     onClose();
     fetchExpense();
    }).catch(error => {
      console.log(error);
    })
  

}
  //   if(currentData?.id)
  //   {
  //     editExpense()
  //   }else{
  //     addExpense()
  //   }

  // };

  // const editExpense = () => {
  //   axios
  //     .put(BASE_URL + "Expense/" + currentData?.id,expense)
  //     .then(() => {
  //       onClose();
  //       fetchExpense();
  //       toast({
  //         title: "Expense Updated.",
  //         description: "Expense Updated Successfully",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const addExpense = () => {
  //   axios
  //     .post(BASE_URL + "Expense", expense)
  //     .then((response) => {
  //       onClose();
  //       fetchExpense();
  //       toast({
  //         title: "Expense Added.",
  //         description: "Expense Added Successfully",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  //   console.log(expense);
  // };

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
                placeholder="Name"
                value={expense.name}
                onChange={(e) =>
                  setExpense({ ...expense, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={expense.description}
                onChange={(e) =>
                  setExpense({ ...expense, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={expense.price}
                onChange={(e) =>
                  setExpense({...expense, price:(e.target.value)})
                }
              />
              <Text>Is in Store?</Text>
              <Switch
                isChecked={expense.isInStore}
                onChange={(e) =>
                  setExpense({ ...expense, isInStore: e.target.checked })
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



// const {
//   register,
//   handleSubmit,
//   formState: { errors },
// } = useForm<FormData>({
//   resolver: zodResolver(schema),
//   defaultValues: expense || undefined,
// });

//   const onSubmitHandler = (data: FormData) => {
//     onSubmit(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmitHandler)} className="mb-3">
//       <div className="mb-3">
//         <label htmlFor="description" className="form-label">Description</label>
//         <input
//           {...register("description")}
//           id="description"
//           type="text"
//           className={`form-control ${errors.description ? "is-invalid" : ""}`}
//         />
//         {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
//       </div>

//       <div className="mb-3">
//         <label htmlFor="amount" className="form-label">Amount</label>
//         <input
//           {...register("amount", { valueAsNumber: true })}
//           id="amount"
//           type="number"
//           step="0.01"
//           className={`form-control ${errors.amount ? "is-invalid" : ""}`}
//         />
//         {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
//       </div>

//       <div className="mb-3">
//         <label htmlFor="category" className="form-label">Category</label>
//         <select
//           {...register("category")}
//           id="category"
//           className={`form-select ${errors.category ? "is-invalid" : ""}`}
//         >
//           <option value="Select a Category">Select a Category</option>
//           {categories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//         {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
//       </div>

//       <button type="submit" className="btn btn-primary me-2">
//         {expense ? "Update" : "Add"} Expense
//       </button>
//       <button type="button" className="btn btn-secondary" onClick={onClose}>
//         Cancel
//       </button>
//     </form>
//   );
// };

// export default ExpenseForm;
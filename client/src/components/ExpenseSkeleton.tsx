import {
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
    Skeleton,
    SkeletonCircle,
  } from "@chakra-ui/react";
  
  import { AddIcon } from "@chakra-ui/icons";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { BASE_URL } from "../constant";
import React from "react";
  
  
  
  interface Expense {
    id: number;
    Description: string;
    Amount: string;
    Category: string;
    // email: string;
  }
  
  const StudentSkeleton = () => {
  
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
            <Heading>
              <Skeleton>Expense List</Skeleton>
            </Heading>
            <Button color="cyan.300" leftIcon={<AddIcon />}>
                {" "}
               <Skeleton>Add Expense</Skeleton>
            </Button>
          </Flex>
  
          <TableContainer>
              <Table variant="striped" colorScheme="cyan">
                <Thead>
                  <Tr>
                    <Th>
                      <Skeleton>Id</Skeleton>
                    </Th>
                    <Th>
                      <Skeleton>Name</Skeleton>
                    </Th>
                    <Th>
                      <Skeleton>Address</Skeleton>
                    </Th>
                    <Th>
                      <Skeleton>Phone Number</Skeleton>
                    </Th>
                    {/* <Th>
                      <Skeleton>Email</Skeleton>
                    </Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {Array.from({ length:5 }).map((_,index) => (
                    <Tr key={index}>
                      <Td>
                      <Skeleton>01</Skeleton>
                    </Td>
                    <Td>
                      <HStack>
                        <SkeletonCircle>ID</SkeletonCircle>
                        <Text>
                          <Skeleton>Expense Name</Skeleton>
                        </Text>
                      </HStack>
                    </Td>
                    
                    {/* <Td>
                      <Skeleton>Expense Email</Skeleton>
                    </Td> */}
                    <Td>
                      
                      <Badge>
                        <Skeleton>Yes</Skeleton>
                      </Badge>
                    </Td>
                    <Td>
                      <Skeleton>12345</Skeleton>
                    </Td>
                    <Td>
                      <HStack>
                        <SkeletonCircle>1</SkeletonCircle>
                        <SkeletonCircle>1</SkeletonCircle>
                        
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  };
  
  export default StudentSkeleton;
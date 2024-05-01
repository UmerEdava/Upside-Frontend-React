import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showToast = useShowToast();

  const [inputs, setInputs] = useState<{
    text: string;
    img: string;
  }>({ text: "", img: ""});

  const handleValueChange = (name: string) => (e: any) => {
    setInputs({
      ...inputs,
      [name]: e.target.value,
    });
  };

const handleCreatePost = async () => {
    try {    
      const res = await fetch("/api/v1/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false); 
      }

    } catch (error) {
      showToast("Error", "Something went wrong", "error", 3000, false);
    }
  };


  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        bg={useColorModeValue("gray.300", "gray.dark")}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl >
              <Textarea 
              placeholder="Something in your mind..."
              value={inputs.text}
              onChange={handleValueChange("text")}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleCreatePost}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

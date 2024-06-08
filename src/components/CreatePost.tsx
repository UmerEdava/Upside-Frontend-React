import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState } from "recoil";
import userPostsAtom from "../atoms/userPostsAtom";

const CreatePost = () => {

  const [posts, setPosts] = useRecoilState<any>(userPostsAtom);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const showToast = useShowToast();

  const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef<any>(null)

  const [inputs, setInputs] = useState<{
    text: string
  }>({ text: "" });
  const [remainingChar, setRemainingChar] = useState(500);
  const maxChar = 500;
  const [loading, setLoading] = useState(false);

  const handleValueChange = (name: string) => (e: any) => {
    if (name === 'text') {
      const inputText = e.target.value

      if (inputText.length > maxChar) {
        const truncatedText = inputText.substring(0, maxChar);
        setInputs({
          ...inputs,
          [name]: truncatedText,
        });
        setRemainingChar(0);
      } else {
        setInputs({
          ...inputs,
          [name]: e.target.value,
        });
        setRemainingChar(maxChar - inputText.length);
      }

    } else {
      setInputs({
        ...inputs,
        [name]: e.target.value,
      });
    }
  };





const handleCreatePost = async () => {
  setLoading(true);
    try {    
      const res = await fetch("/api/v1/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...inputs, img: imgUrl}),
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false); 
      }

      showToast("Success", "Post created successfully", "success", 3000, false);

      setInputs({ text: "" });
      setImgUrl("");

      console.log("🚀 ~ handleCreatePost ~ data?.data:", data?.data)
      setPosts([data?.data, ...posts]);

      onClose();

    } catch (error) {
      showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoading(false);
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
              <Text fontSize={"sm"} fontWeight={"bold"} textAlign={"right"} m={1} color={'gray.800'}>
                {remainingChar}/{maxChar}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImgChange}
              />

              <BsFillImageFill
                onClick={() => imageRef.current!.click()}
                size={16}
                style={{ marginLeft: '5px', cursor: "pointer" }}
              />

              {imgUrl && (
                <Flex mt={5} w={'full'} position={"relative"}>
                  <Image src={imgUrl} alt={"Selected image"} />
                  <CloseButton
                    onClick={() => setImgUrl("")}
                    bg={"gray.800"}
                    position={"absolute"}
                    top={2}
                    right={2}
                    />
                </Flex>
              )}


            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleCreatePost} isLoading={loading}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

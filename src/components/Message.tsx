import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedChatAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsClock } from "react-icons/bs";

const Message = ({
  message,
  ownMessage,
}: {
  message: { text: string, img: string, seen: boolean, status: string };
  ownMessage: boolean;
}) => {
  const selectedChat = useRecoilValue(selectedChatAtom);
  const currentUser = useRecoilValue(userAtom);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>

          {message?.text && (
            <Flex maxW={"350px"} bg={"green.800"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message?.text}</Text>
              <Box alignSelf={'flex-end'} ml={1} color={message?.seen ? "blue.400" : ""} fontWeight={'bold'}>
                <BsCheck2All size={16}/>
                {/* <BsClock size={10} color="#b6b6b6"/> */}
              </Box>
            </Flex>
          )}

          {message?.img && !isImageLoaded && (
            <Flex mt={5} w={"200px"}>
             <Image src={message.img} hidden onLoad={() => setIsImageLoaded(true)} alt="img" borderRadius={4}/>
             <Skeleton h={200} w={"200px"} borderRadius={4}/>
            </Flex>
          )}

          {message?.img && isImageLoaded && (
            <Flex mt={5} w={"200px"}>
             <Image src={message.img} alt="img" borderRadius={4}/>
             <Box alignSelf={'flex-end'} ml={1} color={message?.seen ? "blue.400" : ""} fontWeight={'bold'}>
              <BsCheck2All size={16}/>
            </Box>
            </Flex>
          )}

          <Avatar src={currentUser?.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedChat?.profilePic} w={7} h={7} />

          {message?.text && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={1}
              borderRadius={"md"}
              color={"black"}
            >
              {message?.text}
            </Text>
          )}

          {message?.img && !isImageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} hidden onLoad={() => setIsImageLoaded(true)} alt="img" borderRadius={4}/>
              <Skeleton h={200} w={"200px"} borderRadius={4}/>
           </Flex>
          )}

          {message?.img && isImageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="img" borderRadius={4}/>
            </Flex>
          )}

        </Flex>
      )}
    </>
  );
};

export default Message;

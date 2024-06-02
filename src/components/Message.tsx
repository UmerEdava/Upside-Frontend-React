import { Avatar, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { selectedChatAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

const Message = ({message, ownMessage}: {message: {text: string}, ownMessage: boolean}) => {

  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const [currentUser, setCurrentUser] = useRecoilState(userAtom); 

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            {message?.text}
          </Text>
          <Avatar src={currentUser?.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedChat?.profilePic} w={7} h={7} />
          <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
            {message?.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;

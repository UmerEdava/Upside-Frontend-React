import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useRecoilState } from "recoil";
import { selectedChatAtom } from "../atoms/messagesAtom";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

const MessageContainer = () => {
  const showToast = useShowToast();

  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      
      if (!selectedChat?._id) return

      if (selectedChat?.notChatted) {
        setMessages([]);
        return;
      }

      setLoadingMessages(true);
      // Fetch chats
      const res = await fetch(`/api/v1/chat/${selectedChat?._id}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setMessages(data?.data?.messages);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [showToast, selectedChat?._id]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef?.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedChat?.profilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedChat?.username}
          <Image src={"/verified.png"} w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflowY={"auto"}
        px={2}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 == 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 == 0 && <SkeletonCircle size={"7"} />}

              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>

              {i % 2 != 0 && <SkeletonCircle size={"7"} />}
            </Flex>
          ))}

        {!loadingMessages &&
          messages?.map((msg: any) => (
            <Message
              ownMessage={msg?.sender == currentUser?._id}
              message={msg}
            />
          ))}

          <div ref={bottomRef} />
      </Flex>

      <MessageInput setMessages={setMessages}/>
    </Flex>
  );
};

export default MessageContainer;

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
import { useRecoilState, useRecoilValue } from "recoil";
import { chatsAtom, selectedChatAtom } from "../atoms/messagesAtom";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageNotificationSound from "../assets/audio/message-notification.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const {socket} = useSocket();
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  
  const selectedChat = useRecoilValue(selectedChatAtom);
  const currentUser = useRecoilValue(userAtom);
  const [chats, setChats] = useRecoilState(chatsAtom);

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState<any>([]);
  
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
    socket.on("newMessage", (newMessage: any) => {
      if (selectedChat?._id == newMessage.chatId) {
        setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      }

      if(!document.hasFocus()) {
        const audio = new Audio(messageNotificationSound);
        audio.play();
      }

      setChats((prevChats: any) => {
        const updatedChats = prevChats.map((chat: any) => {
          if (chat._id === newMessage?.chatId) {
            return {
              ...chat,
              lastMessage: {
                text: newMessage.text,
                sender: newMessage.sender,
              },
              ...(selectedChat?._id != chat?._id && { unSeenCount: chat.unSeenCount + 1 }),
            };
          }
          return chat;
        }) 
        return updatedChats       
      })

    })

    return () => socket.off("newMessage")
  }, [socket, selectedChat, setChats])

  useEffect(() => {
    const lastMessageFromOtherUser = messages?.length && messages[messages.length - 1].sender != currentUser?._id

    if (lastMessageFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        chatId: selectedChat._id,
        userId: selectedChat.userId
      })

      setChats((prevChats: any) => {
        const updatedChats = prevChats.map((chat: any) => {
          console.log('hereeeee')
          if (chat._id == selectedChat?._id) {
            console.log("innnnnnn fiiiiiiifffff")
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                seen: true
              },
              unSeenCount: 0
            }
          }
          return chat;
        }) 
        return updatedChats       
      })
    }

    socket.on("seenMessages", ({chatId}: any) => {
      if (selectedChat?._id == chatId) {
        setMessages((prevMessages: any) => {
          const updatedMessages = prevMessages.map((message: any) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true
              };
            }
            return message;
          }) 
          return updatedMessages       
        })
      }
    })

    // return () => socket.off("messagesSeen")
  }, [socket, currentUser?._id, messages, selectedChat])

  useEffect(() => {
    fetchMessages();
  }, [showToast, selectedChat?._id]);

  useEffect(() => {
    if (bottomRef?.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  useEffect(() => {
    console.log('chats changed: ',chats)
  }, [chats]);

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
              key={msg?._id}
            />
          ))}

          <div ref={bottomRef} />
      </Flex>

      <MessageInput setMessages={setMessages}/>
    </Flex>
  );
};

export default MessageContainer;

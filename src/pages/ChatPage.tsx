import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatsAtom, selectedChatAtom } from "../atoms/messagesAtom";
import { useSocket } from "../context/SocketContext";
import customFetch from "../api";

const ChatPage = () => {
  const showToast = useShowToast();

  const [chats, setChats] = useRecoilState(chatsAtom);
  const selectedChat = useRecoilValue(selectedChatAtom);

  const [loadingChats, setLoadingChats] = useState(true);
  const [searchKey, setSearchKey] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const { socket, onlineUsers } = useSocket();

  const fetchChats = async () => {
    try {
      // Fetch chats
      const res = await customFetch(`/api/v1/chat/getAllChats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      console.log("🚀 ~ fetchFeedPosts ~ data?.data?.feedPosts:", data?.data);
      setChats(data?.data?.chats);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [showToast]);

  const handleSearchUsers = async (e: any) => {
    e.preventDefault();
    try {

      if(!searchKey) return

      setSearchLoading(true);
      setLoadingChats(true);
      
      // Fetch chats
      const res = await customFetch(`/api/v1/chat/search/${searchKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      // setSearchUsers(data?.data);
      setChats(data?.data?.chats);
      setSearchKey('');
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setSearchLoading(false);
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    socket?.on("seenMessages", ({chatId}: any) => {
        setChats((prevChats: any) => {
          const updatedChats = prevChats.map((chat: any) => {
            if (chat._id == chatId) {
              return {
                ...chat,
                lastMessage: {
                  ...chat.lastMessage,
                  seen: true
                }
              }
            }
            return chat;
          }) 
          return updatedChats       
        })
    })
  }, [socket, setChats])

  useEffect(() => {
    socket?.on("newMessage", (newMessage: any) => {
      setChats((prevChats: any) => {
        const updatedChats = prevChats.map((chat: any) => {
          console.log('jk',chat?.unSeenCount)
          if (chat._id === newMessage?.chatId) {
            return {
              ...chat,
              lastMessage: {
                text: newMessage.text,
                sender: newMessage.sender,
                ...(selectedChat?._id == newMessage?.chatId ? {seen: true} : {seen: false}),
              },
              ...(selectedChat?._id != newMessage?.chatId ? {unSeenCount: chat?.unSeenCount ? chat?.unSeenCount + 1 : 1} : {}),
            };
          }
          return chat;
        }) 
        return updatedChats       
      })
    })
  }, [socket, setChats])

  

  return (
    <Box
      position={"relative"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      transform={"translateX(-50%)"}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your conversations
          </Text>
          <form onSubmit={handleSearchUsers}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search users" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
              <Button size={"sm"} onClick={handleSearchUsers} isLoading={searchLoading}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingChats &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size="10" />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <SkeletonCircle h={"10px"} w={"80px"} />
                  <SkeletonCircle h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingChats &&
            chats?.length > 0 &&
            chats?.map((chat: any) => (
              <Conversation key={chat?._id} chat={chat} isOnline={onlineUsers.includes(chat?.participants[0]?._id)} />
            ))}
        </Flex>

        {!selectedChat?._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a chat to start messaging</Text>
          </Flex>
        )}

        {selectedChat?._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;

import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { chatsAtom, selectedChatAtom } from "../atoms/messagesAtom";

const MessageInput = ({ setMessages }: { setMessages: any }) => {

  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const [chats, setChats] = useRecoilState(chatsAtom);

  const showToast = useShowToast();

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!text || !selectedChat?.userId) return;

      // Calling send message API
      const res = await fetch(`/api/v1/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedChat?.userId,
          message: text,
        }),
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setMessages((messages: any) => [...messages, data?.data ]);

      setText("");

      setChats((chats: any) => {
        return chats.map((chat: any) => {
          if (chat._id === selectedChat?._id) {
            return {
              ...chat,
              lastMessage: {
                text: text,
                sender: data?.data?.sender
              }
            };
          }
          return chat;
        });
      });

    } catch (error) {
      console.log("🚀 ~ handleSendMessage ~ error:", error)
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input w={"full"} placeholder="Type your message here" value={text} onChange={(e) => setText(e.target.value)} />
        <InputRightElement>
          <IoSendSharp onClick={handleSendMessage} cursor={"pointer"}/>
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;

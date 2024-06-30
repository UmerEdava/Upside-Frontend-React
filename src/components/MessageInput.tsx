import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatsAtom, selectedChatAtom } from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import customFetch from "../api";
import userAtom from "../atoms/userAtom";
import { MESSAGE_STATUS_TYPES } from "../types/messageTypes";

const MessageInput = ({ setMessages, setCurrentUserSend }: { setMessages: any, setCurrentUserSend?: any }) => {

  const selectedChat = useRecoilValue(selectedChatAtom);
  const setChats = useSetRecoilState(chatsAtom);
  const currentUser = useRecoilValue(userAtom);

  
  const showToast = useShowToast();

  const { onClose } = useDisclosure();

  const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef<any>(null)

  // const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);


  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    try {
      // setLoading(true);

      if (!selectedChat?.userId) return;

      if (!text && !imgUrl) return;

      if (isSending) return;


      setIsSending(true)


      const tempId = Date.now();

      const tempMessage = {
        _id: tempId,
        chatId: selectedChat?._id,
        ...(text && { text }),
        ...(imgUrl && { img: imgUrl }),
        sender: currentUser?._id, // or your user identifier
        status: MESSAGE_STATUS_TYPES.PENDING,
      };

      // Optimistically update the messages state
      setMessages((prevMessages: any) => [...prevMessages, tempMessage]);

      setText('');

      // Calling send message API
      const res = await customFetch(`/api/v1/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedChat?.userId,
          message: text,
          img: imgUrl
        }),
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      console.log("🚀 ~ handleSendMessage ~ tempId:", tempId)
      
      setCurrentUserSend(true)
      setMessages((prevMessages: any) =>
        prevMessages.map((msg: any) => 
          msg._id === tempId ? { ...msg, id: data.data?.id, status: MESSAGE_STATUS_TYPES.SENT } : msg
        )
      );

      // setMessages((messages: any) => [...messages, data?.data ]);

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

      setImgUrl('');

    } catch (error) {
      console.log("🚀 ~ handleSendMessage ~ error:", error)
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      // setLoading(false);
      setIsSending(false);
    }
  };




  return (
    <Flex gap={2} alignItems={'center'}>

    <form onSubmit={handleSendMessage} style={{flex: 95}}>
      <InputGroup>
        <Input w={"full"} placeholder="Type your message here" value={text} onChange={(e) => setText(e.target.value)} />
        <InputRightElement>
          <IoSendSharp onClick={handleSendMessage} cursor={"pointer"}/>
        </InputRightElement>
      </InputGroup>
    </form>

    <Flex flex={5} cursor={'pointer'}>
      <BsFillImageFill size={20} onClick={() => imageRef.current.click()}/>
      <Input type="file" hidden ref={imageRef} onChange={handleImgChange}/>
    </Flex>
    <Modal isOpen={imgUrl ? true : false} onClose={() => {
      onClose()
      setImgUrl('')
    }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex mt={5} w={'full'}>
            <Image src={imgUrl} alt="img" w={'100%'} />
          </Flex>
          <Flex justifyContent={'flex-end'} my={2}>
            {!isSending ? <IoSendSharp size={24} cursor={'pointer'} onClick={handleSendMessage}/> : <Spinner size={'md'}/>}
          </Flex>
        </ModalBody>
        
      </ModalContent>
    </Modal>


    </Flex>
  );
};

export default MessageInput;

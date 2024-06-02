import { Avatar, AvatarBadge, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { BsCheck2All } from 'react-icons/bs'
import { selectedChatAtom } from '../atoms/messagesAtom'

const Conversation = ({chat}: {chat: any}) => {

  const currentUser = useRecoilValue(userAtom)

  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom)

  const user = chat.participants[0]

  const {colorMode} = useColorMode()
  console.log("🚀 ~ Conversation ~ colorMode:", currentUser)

  return (
    <Flex
      gap={4}
      alignItems={'center'}
      p={1}
      _hover={{
        bg: useColorModeValue('gray.600', 'gray.dark'),
        color: 'white',
        cursor: 'pointer',
      }}
      borderRadius={'md'}
      onClick={() => setSelectedChat({
        _id: chat?._id,
        userId: user?._id,
        username: user?.username,
        profilePic: user?.profilePic,
        notChatted: chat?.notChatted
      })}
      bg={selectedChat?._id == chat?._id ? (colorMode == "light" ? "gray.600" : "gray.dark") : ''}
    >
      <WrapItem
      >
        <Avatar size={{
          base: 'xs',
          sm: 'sm',
          md: 'md'
        }} name={user?.username} src={user?.profilePic} >
        <AvatarBadge boxSize={'1em'} bg={'green.500'} />
        </Avatar>
      </WrapItem>
        <Stack direction={'column'} fontSize={'sm'}>
          <Text fontWeight={700} display={'flex'} alignItems={'center'}>
            {user?.username} <Image src={'/verified.png'} w={4} h={4} ml={1} />
          </Text>
          
          <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
            {currentUser?._id == chat?.lastMessage?.sender ? <BsCheck2All size={16}/> : ""}
            {chat?.lastMessage?.text?.length > 18 ? chat?.lastMessage?.text?.substring(0, 18) + '...' : chat?.lastMessage?.text}
            </Text>
        </Stack>

    </Flex>
  )
}

export default Conversation
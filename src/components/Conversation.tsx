import { Avatar, AvatarBadge, Badge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { BsCheck2All } from 'react-icons/bs'
import { selectedChatAtom } from '../atoms/messagesAtom'

const Conversation = ({chat, isOnline}: {chat: any, isOnline: boolean}) => {

  const currentUser = useRecoilValue(userAtom)

  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom)

  const user = chat.participants[0]

  const {colorMode} = useColorMode()

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
        {isOnline && <AvatarBadge boxSize={'1em'} bg={'green.500'} />}
        </Avatar>
      </WrapItem>
        <Stack direction={'column'} fontSize={'sm'}>
          <Text fontWeight={700} display={'flex'} alignItems={'center'}>
            {user?.username} <Image src={'/verified.png'} w={4} h={4} ml={1} />
          </Text>
          
          <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
            {currentUser?._id == chat?.lastMessage?.sender ? (
              // <Box color={chat?.lastMessage?.seen ? "blue.400" : ""}>
                <BsCheck2All size={16} style={{ color: chat?.lastMessage?.seen ? "#4299e1" : ""}}/>
              // </Box>
            ) : ""}
            {chat?.lastMessage?.text?.length > 18 ? chat?.lastMessage?.text?.substring(0, 18) + '...' : chat?.lastMessage?.text}
          </Text>
        </Stack>

        {currentUser?._id != chat?.lastMessage?.sender &&!chat?.lastMessage?.seen && (
          <div style={{marginLeft: 'auto', marginRight: '10px'}}>
          <Box
            transform="translate(50%, -50%)"
            borderRadius="full"
            bg="#409eda"
            color="white"
            fontSize="0.8em"
            w="18px"
            h="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {chat?.unSeenCount}
          </Box>
          </div>
        )}


    </Flex>
  )
}

export default Conversation
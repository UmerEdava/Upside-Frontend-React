import {
  Avatar,
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

function UserHeader() {
  const toast = useToast();

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied",
        // description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        // isClosable: true,
      });
    });
  };

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              Mark Zuckerburg
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"xs"}>markzuckerburg</Text>
              <Text
                fontSize={"sm"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar name="Mark Zuckerburg" src="/zuck-avatar.png" size={{
              base: "md",
              sm: "lg",
              md: "xl"
            }} />
          </Box>
        </Flex>
        <Text>Co-founder & CTO @Meta.</Text>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex alignItems={"center"} gap={2}>
            <Text color={"gray.light"}>2.3K Followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                      Copy Link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>

        <Flex w={'full'}>
            <Flex flex={1} justifyContent={'center'} pb={3} cursor={'pointer'} borderBottom={'1.5px solid white'}>
                <Text fontWeight={'bold'} >Threads</Text>
            </Flex>
            <Flex flex={1} justifyContent={'center'} pb={3} cursor={'pointer'} borderBottom={'1px solid gray'} color={'gray.light'}>
                <Text fontWeight={'bold'} >Threads</Text>
            </Flex>
        </Flex>
      </VStack>
    </>
  );
}

export default UserHeader;
